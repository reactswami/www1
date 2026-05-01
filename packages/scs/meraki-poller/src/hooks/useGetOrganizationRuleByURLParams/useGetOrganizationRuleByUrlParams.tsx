import { useParams } from 'react-router-dom';
import { useFetchGlobalConfig } from '..';
import { type ApiOrganizationCustomRule } from '~/types/api';

export const useGetOrganizationRuleByURLParams =
   (): ApiOrganizationCustomRule => {
      const { data } = useFetchGlobalConfig();
      const { rule: name } = useParams<{ rule: string }>();
      if (!name) {
         throw Error('Error getting the rule name from the url');
      }

      const rule = data?.data.rules.organization.find(
         (rule) => rule.id.toString() === name
      );

      if (!rule) {
         throw new Error(
            'Failed to find the organization rule. If the problem persists, please contact Statseeker support.'
         );
      }

      return rule;
   };
