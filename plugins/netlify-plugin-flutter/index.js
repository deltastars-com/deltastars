export const onPreBuild = async ({ utils }) => {
  console.log('Skipping flutter build for React app');
  utils.status.show({ summary: 'Skipped flutter build' });
}
