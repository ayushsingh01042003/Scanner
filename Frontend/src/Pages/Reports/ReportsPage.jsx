import React, { useState } from 'react';
import ReportDetails from './ReportDetails';

const ReportsPage = () => {
  const [selectedReportId, setSelectedReportId] = useState(1);

  const handleReportClick = (id) => {
    setSelectedReportId(id);
  };

  return (
    <div className="flex w-full">
      <ReportDetails selectedReportId={selectedReportId} onReportClick={handleReportClick} />
    </div>
  );
};

export default ReportsPage;