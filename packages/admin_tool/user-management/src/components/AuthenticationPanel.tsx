import { Flex, Select, FormControl, FormLabel, Switch, FormHelperText } from '@chakra-ui/react';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { Alert } from '@statseeker/components/Feedback/Alert';
import { Input } from "@statseeker/components/Legacy/Input";
import { useFormContext } from 'react-hook-form';
import CertFileInput from './CertFileInput';
import { type GlobalOptionsFormProps } from '~/types/type';


export default function AuthenticationPanel({
    use_user_auth,
    selectedAuthMethod,
    isDisabled,
    isBindPasswordAlreadySet,
}: {
    use_user_auth: boolean;
    selectedAuthMethod: string;
    isDisabled: boolean;
    isBindPasswordAlreadySet?: boolean;
}) {
    const { getValues, setValue, register, watch, formState: { errors } } = useFormContext<GlobalOptionsFormProps>();

    return (
        <Panel title="Authentication">
            <FormControl>
                {use_user_auth && selectedAuthMethod !== 'LDAP' ? (
                    <Alert
                        mt={2}
                        mb={2}
                        variant='warning'
                        description={`The existing user authentication method (${selectedAuthMethod}) does not support Active Directory user synchronization.`}
                    />
                ) : null}
                <Flex direction={'column'}>
                    <FormLabel>
                        Use existing configuration
                    </FormLabel>
                    <Switch
                        {...register('use_user_auth')}
                    />
                </Flex>
                <FormHelperText>
                    Use the same details specified in the Active Directory user authentication configuration.
                </FormHelperText>
            </FormControl>
            <Flex direction="column" gap={2}>
                <Flex w={350}>
                    <Input
                        isRequired={!isDisabled}
                        label="LDAP Server"
                        {...register('ldap_server', {
                            required: !isDisabled ? 'LDAP Server is required.' : false,
                        })}
                        isDisabled={isDisabled}
                        error={errors.ldap_server?.message}
                    />
                </Flex>
                <Flex w={350}>
                    <Input
                        type="number"
                        label="Port"
                        min={1}
                        max={65535}
                        isRequired={!isDisabled}
                        {...register('ldap_port', {
                            valueAsNumber: true,
                            required: !isDisabled ? 'Port is required.' : false,
                            min: { value: 1, message: 'Port must be >= 1' },
                            max: { value: 65535, message: 'Port must be <= 65535' },
                        })}
                        error={errors.ldap_port?.message}
                        isDisabled={isDisabled}
                    />
                </Flex>
                <Flex w={350}>
                    <Input
                        isRequired={!isDisabled}
                        label="Base DN"
                        {...register('ldap_base_dn', {
                            required: !isDisabled ? 'Base DN is required.' : false,
                        })}
                        isDisabled={isDisabled}
                        error={errors.ldap_base_dn?.message}
                    />
                </Flex>
                <Flex w={350}>
                    <FormLabel>
                        Secure Mode
                        <Select
                            {...register('ldap_secure_mode')}
                            isDisabled={isDisabled}
                            onChange={(e) => {
                                /* handle setting the port based on the secure mode */
                                const val = e.target.value;
                                if (val === 'SSL' && getValues('ldap_port') === 389) {
                                    setValue('ldap_port', 636);
                                }
                                else if ((val === 'NONE' || val === 'STARTTLS') && getValues('ldap_port') === 636) {
                                    setValue('ldap_port', 389);
                                }

                                /* call the original onChange handler to ensure react-hook-form is updated */
                                register('ldap_secure_mode').onChange(e);
                            }}
                        >
                            <option value="NONE">None</option>
                            <option value="SSL">SSL/TLS</option>
                            <option value="STARTTLS">STARTTLS</option>
                        </Select>
                    </FormLabel>
                </Flex>
                {(watch('ldap_secure_mode') === 'SSL' || watch('ldap_secure_mode') === 'STARTTLS') && (
                    <>
                        <Flex w={350}>
                            <FormControl>
                                <FormLabel>
                                    CA Certificate
                                </FormLabel>
                            </FormControl>
                        </Flex>
                        <CertFileInput
                            isDisabled={isDisabled}
                        />
                    </>
                )}
                <Flex w={350}>
                    <Input
                        isRequired={!isDisabled}
                        label="Bind DN"
                        {...register('ldap_bind_dn', {
                            required: !isDisabled ? 'Bind DN is required.' : false,
                        })}
                        isDisabled={isDisabled}
                        error={errors.ldap_bind_dn?.message}
                    />
                </Flex>
                <Flex w={350}>
                    <Input
                        type="password"
                        label="BIND Password"
                        isRequired={!isBindPasswordAlreadySet && !isDisabled}
                        placeholder={isBindPasswordAlreadySet ? 'unchanged' : ''}
                        {...register('ldap_bind_password', {
                            required: !isBindPasswordAlreadySet && !isDisabled ? 'BIND Password is required.' : false,
                        })}
                        error={errors.ldap_bind_password?.message}
                        isDisabled={isDisabled}
                    />
                </Flex>
                <Flex w={350}>
                    <Input
                        isRequired={!isDisabled}
                        label="AD Domain"
                        {...register('ldap_ad_domain', {
                            required: !isDisabled ? 'AD Domain is required.' : false,
                        })}
                        isDisabled={isDisabled}
                        error={errors.ldap_ad_domain?.message}
                    />
                </Flex>
            </Flex>
        </Panel>
    );
}