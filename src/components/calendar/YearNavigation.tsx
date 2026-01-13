import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

interface YearNavigationProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onRefresh?: () => void;
}

export const YearNavigation: React.FC<YearNavigationProps> = ({
  currentYear,
  onYearChange,
  onRefresh,
}) => {
  const handlePrevYear = () => {
    onYearChange(currentYear - 1);
  };

  const handleNextYear = () => {
    onYearChange(currentYear + 1);
  };

  const handleToday = () => {
    onYearChange(new Date().getFullYear());
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
      <ButtonGroup>
        <Button variant="outline-primary" onClick={handlePrevYear}>
          ‹ {currentYear - 1}
        </Button>
        <Button variant="primary" onClick={handleToday}>
          {currentYear}
        </Button>
        <Button variant="outline-primary" onClick={handleNextYear}>
          {currentYear + 1} ›
        </Button>
      </ButtonGroup>
      
      {onRefresh && (
        <Button variant="outline-secondary" onClick={onRefresh} size="sm">
          🔄 Refresh
        </Button>
      )}
    </div>
  );
};
