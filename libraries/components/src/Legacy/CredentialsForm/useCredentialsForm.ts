import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { type CredentialFormProps } from './types';

export function useCredentialsForm({ props }: { props: CredentialFormProps }) {
   const methods = useForm<SNMPCredential>({
      defaultValues: props.defaultValues,
   });
   const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      control,
   } = methods;
   const version = useWatch({ name: 'version', control });
   const authMethod = useWatch({ name: 'auth_method', control });
   const privacyMethod = useWatch({ name: 'priv_method', control });
   const isSNMPV3 = version?.toString() === '3';
   const showAuthUsername = isSNMPV3;
   const showAuthPassword = authMethod ? isSNMPV3 && authMethod !== '' : false;
   const showPrivacySection = showAuthPassword;
   const showExtraPrivacyFields = privacyMethod
      ? isSNMPV3 && privacyMethod !== '' && authMethod !== ''
      : false;

   const [hasAuthBecomeNone, setAuthNone] = useState(false);
   const [hasPrivBecomeNone, setPrivNone] = useState(false);
   const [hasCommunityBecomeNone, setCommunityNone] = useState(false);

   useEffect(() => {
      if (authMethod === '') {
         setAuthNone(true);
         setPrivNone(true);
      }
   }, [authMethod]);

   useEffect(() => {
      if (privacyMethod === '') {
         setPrivNone(true);
      }
   }, [privacyMethod]);

   useEffect(() => {
      methods.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.mutationIsSuccess]);

   useEffect(() => {
      const { auth_pass, auth_user, priv_pass, community } = props.defaultValues;
      methods.reset({
         ...props.defaultValues,
         auth_pass: auth_pass === 'set' || auth_pass === 'unset' ? '' : auth_pass,
         auth_user: auth_user === 'set' || auth_user === 'unset' ? '' : auth_user,
         priv_pass: priv_pass === 'set' || priv_pass === 'unset' ? '' : priv_pass,
         community: community === 'set' || community === 'unset' ? '' : community,
      });
      setAuthNone(false);
      setPrivNone(false);
      setCommunityNone(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [props.defaultValues]);

   const getPlaceholder = (
      field: string | null | undefined,
      defaultAuthMethod: string | null | undefined,
      authMethod: string | null | undefined,
      hasBecomeNone: boolean
   ) => {
      if (field === 'set' || field === 'unset') {
         // Path for editing a credential, when the authentication is not set
         if (defaultAuthMethod === '') {
            if (authMethod === '') {
               if (props.mode === 'copy') {
                  return '';
               } else {
                  return field === 'unset' ? '' : 'unchanged';
               }
            } else {
               if (!hasBecomeNone) {
                  if (props.mode === 'copy') {
                     return '';
                  } else {
                     return field === 'unset' ? '' : 'unchanged';
                  }
               }
            }
         } else {
            // Path for editing a credential, when the authentication is set
            if (props.mode === 'copy') {
               return '';
            } else {
               return 'unchanged';
            }
         }
      } else {
         // Path for adding a credential
         if (defaultAuthMethod === undefined) {
            return '';
         } else if (defaultAuthMethod === '') {
            if (authMethod === '') {
               return '';
            }
         }
      }

      return '';
   };
   const getAuthUserPlaceholder = () => {
      return getPlaceholder(
         props.defaultValues.auth_user,
         props.defaultValues.auth_method,
         authMethod,
         hasAuthBecomeNone || props.defaultValues.auth_user !== 'set'
      );
   };
   const getAuthPassPlaceholder = () => {
      return getPlaceholder(
         props.defaultValues.auth_pass,
         props.defaultValues.auth_method,
         authMethod,
         hasAuthBecomeNone
      );
   };
   const getPrivPlaceholder = () => {
      return getPlaceholder(
         props.defaultValues.auth_pass,
         props.defaultValues.priv_method,
         privacyMethod,
         hasPrivBecomeNone || props.defaultValues.priv_method === ''
      );
   };
   const getCommunityPlaceholder = () => {
      return props.mode !== 'copy' &&
         props.defaultValues?.community === 'set' &&
         !hasCommunityBecomeNone
         ? 'unchanged'
         : '';
   };

   useEffect(() => {
      if (version < 3) {
         methods.resetField('auth_method');
         methods.setValue('auth_method', '');
         methods.resetField('auth_pass');
         methods.resetField('auth_user');
         methods.setValue('auth_user', null);
         methods.setValue('auth_pass', null);
         methods.resetField('community');
      } else {
         methods.resetField('context');
      }

      if (props.defaultValues.community === 'set' && version < 3) {
         setCommunityNone(false);
      } else {
         setCommunityNone(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [version]);

   useEffect(() => {
      if (authMethod === '') {
         methods.resetField('auth_pass');
         methods.setValue('auth_pass', null);
         methods.resetField('priv_method');
         methods.resetField('priv_pass');
         methods.setValue('priv_method', '');
         methods.setValue('priv_pass', null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [authMethod]);

   useEffect(() => {
      if (privacyMethod === '') {
         methods.resetField('priv_pass');
         methods.setValue('priv_pass', null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [privacyMethod]);

   return {
      showAuthUsername,
      showAuthPassword,
      showPrivacySection,
      showExtraPrivacyFields,
      register,
      errors,
      isDirty,
      handleSubmit,
      isSNMPV3,
      getAuthUserPlaceholder,
      getAuthPassPlaceholder,
      getPrivPlaceholder,
      getCommunityPlaceholder,
   };
}
