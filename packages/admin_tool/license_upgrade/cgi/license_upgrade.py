#!/usr/local/bin/python
#
# All software Copyright 2025 of Techniche Technologies Pty Ltd., All rights reserved.
# Any redistribution or reproduction of part or all of the contents in any form is
# prohibited without express written permission of the company.
#

'''
CGI for adding a new 25.2 license to an older server.
'''

# System imports
import os
from typing import Optional, Dict
import base64

# Statseeker Imports
from ssConstants import SSHOME
from ssUtils.Logging import init_logger
from ssUtils.StatseekerUtils import get_version
from ssCgi.Cgi import require_licence, json_result, get_cgi_params, is_admin_user, html_die, HTTP_BAD_REQUEST
from ssApi.get import ApiGetRequest


LICENSE_PATH = f'{SSHOME}/.licfile'


# Logging
logger = init_logger('license_upgrade')


def response_success(result: Dict, msg: Optional[str] = None) -> Dict:
    """
    Build a response for HTTP requests

    Args:
        result:  Data to send to the user

    Returns:
        The response object to send to the user
    """
    json_result(result=result, meta={'message': msg})
    exit()


def get_remote_hardware_id():
    """
    Get the remote hardware ID from the HA config file

    Returns:
        The remote hardware ID, or None if not found
    """
    cfg_path = "/home/ha/etc/HA.cfg"

    remote_hwid = None
    if os.path.isfile(cfg_path):
        with open(cfg_path, "r", encoding="utf-8") as cfg:
            for line in cfg:
                if line.startswith('REMOTE_HWID'):
                    split = line.split('=')
                    if len(split) != 2:
                        return None
                    remote_hwid = split[1].replace("'","")
                    return remote_hwid

    return remote_hwid


def response_fail(msg: str):
    """
    Print a json message and exit

    Args:
        msg:    The message to return
    """
    json_result(meta={'message': msg}, status_code=[HTTP_BAD_REQUEST])
    exit()


def parse_key(key: Optional[str]) -> Optional[bytes]:
    """
    Parse a base64-encoded license key.

    Args:
        key: The license key to parse

    Returns:
        The decoded license key as bytes, or None if invalid
    """
    if not key or not isinstance(key, str):
        return None
    try:
        return base64.b64decode(key, validate=True)
    except Exception:
        return None


def add_license(key: Optional[str]):
    """
    Add a new 25.3 license file

    Args:
        key: The license key to add
    """
    licdata = parse_key(key)
    if not licdata:
        return response_fail('Invalid license')

    try:
        with open(LICENSE_PATH, 'wb') as f:
            f.write(licdata)
    except Exception as e:
        response_fail(f'Failed to write license file: {e}')
        try:
            os.remove(LICENSE_PATH)
        except:
            pass

    return json_result(result={'success': True})


def get_csrf_token() -> Optional[str]:
    """
    Get the CSRF token for the current user
    """
    try:
        from ssUtils.User import UcmHdl
        ucm = UcmHdl()
        usr = ucm.load_user('admin')
        return ucm.get_csrf_token(usr)
    except:
        return None


def get_license():
    """
    Get the current license information

    Returns:
        The current license information
    """
    output: Dict = {'valid_new_license': os.path.isfile(LICENSE_PATH)}

    req = ApiGetRequest(os.environ['REMOTE_USER'], 'license')
    req.add_fields('hardwareid', 'custnum', 'tier', 'end', 'entityCounts')
    resp = req.run_api_request()
    if not resp.success or len(resp.data) != 1:
        response_fail(f'Unable to load existing license: {resp}')
    remote_hardware_id = get_remote_hardware_id()

    row = resp.data[0]
    output['server_id'] = row['custnum']['description']
    output['hardware_id'] = row['hardwareid']['description'] if remote_hardware_id is None else f'{row["hardwareid"]["description"]},{remote_hardware_id}'
    output['tier'] = row['tier']['description']
    output['not_after'] = row['end']['limit']
    output['perpetual'] = output['not_after'] == 0
    output['device_count'] = row['entityCounts'].get('device', {}).get('total')
    output['port_count'] = row['entityCounts'].get('port', {}).get('total')
    output['csrf_token'] = get_csrf_token()
    output['version'] = get_version()

    return json_result(result=output)


###############################################################################
########################     MAIN FUNCTION     ################################
###############################################################################


def main():
    """
    Main entry point
    """
    if not is_admin_user():
        html_die('Permission denied')
    require_licence()

    # Run the license
    params = get_cgi_params(json_body=True)
    method = os.environ.get('REQUEST_METHOD')
    if method == 'GET':
        return get_license()
    if method == 'POST':
        return add_license(params.get('key'))
    else:
        response_fail('Invalid request method')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:  # pylint: disable=broad-except
        logger.exception(exc, exc_info=True)
else:
    logger.exception('This script should not be imported!')
