export const queryKeys = {
   globalConfig: ['config'],
   layoutAlert: ['config', 'general_alert'], // This is the query key for the general alert badge in the header of the application
   organizations: ['organizations'] as const,
   organizationsDetail: (id: string) =>
      ['organizations', 'detail', id] as const,
};
