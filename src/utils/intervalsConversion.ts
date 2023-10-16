// utils.js or utils.ts

export const convertRateTypeToSeconds = (rateType: string) => {
    const intervals = [
      {
        value: 1000 * 60 * 60 * 24,
        label: "day",
      },
      {
        value: 1000 * 60 * 60 * 24 * 30,
        label: "month",
      },
      {
        value: 1000 * 60 * 60 * 24 * 365,
        label: "year",
      },
    ];
  
    const selectedInterval = intervals.find(
      (interval) => interval.label === rateType
    );
  
    if (selectedInterval) {
      return selectedInterval.value / 1000; // Convert milliseconds to seconds
    }
    return 0;
  };
  