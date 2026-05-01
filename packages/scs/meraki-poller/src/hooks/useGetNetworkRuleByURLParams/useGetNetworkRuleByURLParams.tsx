import { useParams } from 'react-router-dom';
import { useFetchGlobalConfig } from '..';
import { type ApiNetworkCustomRule } from '~/types/api';

export const useGetRuleByURLParams = (): ApiNetworkCustomRule => {
   const { data } = useFetchGlobalConfig();
   const { rule: ruleId } = useParams<{ rule: string }>();
   if (!ruleId) {
      throw Error('Error getting the rule name from the url');
   }

   const rule = data?.data.rules.network.find(
      (rule) => rule.id?.toString() === ruleId
   );

   if (!rule) {
      throw new Error('The rule does not exist.');
   }

   return rule;
};
