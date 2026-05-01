import { Flex, Select, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { Panel } from '@statseeker/components/Disclosure/Panel';
import { Text } from '@statseeker/components/Typography/Text';
import { getProductName } from '@statseeker/utils/environment';
import { useFormContext } from 'react-hook-form';


export default function SynchronizationOptionsPanel() {
    const { register } = useFormContext();

    return (
        <Panel title="Synchronization Options" >
            <FormControl>
                <Flex direction="column" gap={4}>
                    <Flex gap={4}>
                        <Flex flexDir={'column'} w={'30%'}>
                            <FormLabel>
                                Username Attribute
                            </FormLabel>
                            <Select {...register('username_attribute')}>
                                <option value="sAMAccountName">sAMAccountName</option>
                                <option value="userPrincipalName">userPrincipalName</option>
                            </Select>
                        </Flex>
                        <Flex w={'70%'}>
                            <Text>
                                Specifies the Active Directory user attribute used as the username when creating or modifying
                                {getProductName()} user accounts.
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex gap={4}>
                        <Flex flexDir={'column'} w={'30%'}>
                            <FormLabel>Force</FormLabel>
                            <Switch {...register('force')} />
                        </Flex>
                        <Flex w={'70%'}>
                            <Text>
                                By default, manually created Statseeker users with the same username as Active Directory users are
                                overridden on synchronization. When disabled, manually created users with matching usernames will
                                not be synchronized with Active Directory.
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </FormControl>
        </Panel>
    );
}