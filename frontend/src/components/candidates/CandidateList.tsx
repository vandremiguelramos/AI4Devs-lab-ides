import { Helmet } from 'react-helmet-async';

const CandidateList: React.FC = () => {
  if (isLoading) {
    return (
      <PageLayout>
        <Helmet>
          <title>ATS Dashboard - Candidates</title>
        </Helmet>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Spinner 
            size="xl" 
            label="Loading candidates"
            aria-label="Loading candidates"
          />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>ATS Dashboard - Candidates</title>
      </Helmet>
      {/* ... rest of the existing JSX ... */}
    </PageLayout>
  );
};

export default CandidateList; 