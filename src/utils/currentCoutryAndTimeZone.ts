export const getCurrentCountryAndTimeZone = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    return {
      countryName: data.country_name,     // e.g., "India"
      countryCode: data.country_code,     // e.g., "IN"
      timeZone: data.timezone,            // e.g., "Asia/Kolkata"
      utcOffset: data.utc_offset,         // e.g., "+05:30"
    };
  } catch (error) {
    console.error('Failed to fetch location info:', error);
    return {
      countryName: '',
      countryCode: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      utcOffset: '',
    };
  }
};
