# All software Copyright 2022 of Techniche Technologies Pty Ltd., All rights reserved.
# Any redistribution or reproduction of part or all of the contents in any form is
# prohibited without express written permission of the company.
#
include ../../../../cm/Makefile.globals
# Not building using this file, just sourcing the BUILD_DIR
include ../../../../Makefile.module
include ../../../../cm/Makefile.inc

PROJECT_NAME = "nim-edit-snmp-creds"
VITE_MODE = "production"

ifdef DEVEL
	VITE_MODE = "development"
endif

default:
	@echo -e "\033[0;32mBuilding ${PROJECT_NAME} frontend in ${VITE_MODE} mode\033[0m"
ifeq ($(SILENT_FLAG),)
	@nx build ${PROJECT_NAME} --mode=${VITE_MODE} --outputPath "${BUILD_DIR}/${PRODUCT}-${PACKAGE_VERSION}/www/" --skip-nx-cache=${SKIP_NX_CACHE}
else
	@nx build ${PROJECT_NAME} --mode=${VITE_MODE} --outputPath "${BUILD_DIR}/${PRODUCT}-${PACKAGE_VERSION}/www/" --skip-nx-cache=${SKIP_NX_CACHE} > /dev/null 2>&1
endif
