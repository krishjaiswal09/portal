export interface User {
  id?: string
  name?: string
  first_name?: string
  last_name?: string
  email: string
  password?: string
  phone?: string
  phone_number?: string
  avatar?: string
  profile_picture_url?: string
  roles: UserRole[]
  status?: UserStatus
  is_active?: boolean
  kid_friendly?: boolean
  age_type?: AgeType
  ageType?: AgeType
  gender?: 'male' | 'female' | 'other'
  country?: string
  countryFlag?: string
  timezone?: string
  state?: string
  city?: string
  address?: string
  pin?: string
  postal_code?: string
  address_line?: string
  bio?: string
  notes?: string
  art_form?: string | string[]
  date_of_birth?: string
  joinedDate?: string
  lastActive?: string
  familyId?: string
  parentName?: string
  parentCheck?: string
  parent_first_name?: string
  parent_last_name?: string
  parent_id?: number
  parent_email?: string
  parent_phone?: string
  parent_phone_number?: string
  parent_account_manager?: number | null
  parent_date_of_birth?: string
  account_manager_id?: string
  courses?: string[]
  classesAttended?: number
  credits?: number
  nextClass?: string
  creditBalance?: number
  credit_balance?: number
  familyMembers?: string[]
  lastActivity?: string
  email_notification?: boolean
  whatsapp_notification?: boolean
  certifications?: Array<string | number>
  languages?: string[]
  transfer_students?: boolean
  assign_demos?: boolean
  communication_preferences?: {
    whatsapp: boolean
  }
  special_requirements?: string
  meeting_link?: string
  profile_photo?: File | null
  same_as_parent?: boolean
  username?: string
  account_manager?: string
  created_at?: string
  age_group?: number[]
  age_groups?: {
    id: number,
    name: string
  }[]
  preference?: string,
}

export type UserRole = 'student' | 'instructor' | 'parent' | 'admin' | 'support' | 'account_manager' | 'content_manager'
export type UserStatus = 'Active' | 'Inactive' | 'OnBreak' | "Trial"
export type AgeType = 'kid' | 'adult'

export interface UserFilters {
  roles: UserRole[]
  status: UserStatus[]
  ageType: AgeType[]
  countries: string[]
}

export const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 'Santali', 'Kashmiri', 'Nepali', 'Konkani', 'Sindhi', 'Dogri', 'Manipuri (Meitei)', 'Bodo', 'Rajasthani', 'Haryanvi', 'Chhattisgarhi', 'Bhojpuri', 'Awadhi', 'Magahi', 'Marwari', 'Garhwali', 'Kumaoni', 'Tulu'];


export const countries = [
  { name: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  { name: 'Andorra', code: 'AD', flag: '🇦🇩' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴' },
  { name: 'Antigua and Barbuda', code: 'AG', flag: '🇦🇬' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Armenia', code: 'AM', flag: '🇦🇲' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
  { name: 'Bahamas', code: 'BS', flag: '🇧🇸' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  { name: 'Barbados', code: 'BB', flag: '🇧🇧' },
  { name: 'Belarus', code: 'BY', flag: '🇧🇾' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Belize', code: 'BZ', flag: '🇧🇿' },
  { name: 'Benin', code: 'BJ', flag: '🇧🇯' },
  { name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
  { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Brunei', code: 'BN', flag: '🇧🇳' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
  { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
  { name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Cape Verde', code: 'CV', flag: '🇨🇻' },
  { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
  { name: 'Chad', code: 'TD', flag: '🇹🇩' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
  { name: 'Congo', code: 'CG', flag: '🇨🇬' },
  { name: 'Congo (Democratic Republic)', code: 'CD', flag: '🇨🇩' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
  { name: 'Dominica', code: 'DM', flag: '🇩🇲' },
  { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
  { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶' },
  { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
  { name: 'Estonia', code: 'EE', flag: '🇪🇪' },
  { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
  { name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Gabon', code: 'GA', flag: '🇬🇦' },
  { name: 'Gambia', code: 'GM', flag: '🇬🇲' },
  { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Grenada', code: 'GD', flag: '🇬🇩' },
  { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
  { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
  { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
  { name: 'Guyana', code: 'GY', flag: '🇬🇾' },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  { name: 'Kiribati', code: 'KI', flag: '🇰🇮' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
  { name: 'Laos', code: 'LA', flag: '🇱🇦' },
  { name: 'Latvia', code: 'LV', flag: '🇱🇻' },
  { name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
  { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
  { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
  { name: 'Libya', code: 'LY', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮' },
  { name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
  { name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
  { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
  { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Maldives', code: 'MV', flag: '🇲🇻' },
  { name: 'Mali', code: 'ML', flag: '🇲🇱' },
  { name: 'Malta', code: 'MT', flag: '🇲🇹' },
  { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭' },
  { name: 'Mauritania', code: 'MR', flag: '🇲🇷' },
  { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Micronesia', code: 'FM', flag: '🇫🇲' },
  { name: 'Moldova', code: 'MD', flag: '🇲🇩' },
  { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
  { name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
  { name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
  { name: 'Myanmar', code: 'MM', flag: '🇲🇲' },
  { name: 'Namibia', code: 'NA', flag: '🇳🇦' },
  { name: 'Nauru', code: 'NR', flag: '🇳🇷' },
  { name: 'Nepal', code: 'NP', flag: '🇳🇵' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
  { name: 'Niger', code: 'NE', flag: '🇳🇪' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵' },
  { name: 'North Macedonia', code: 'MK', flag: '🇲🇰' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  { name: 'Palau', code: 'PW', flag: '🇵🇼' },
  { name: 'Palestine', code: 'PS', flag: '🇵🇸' },
  { name: 'Panama', code: 'PA', flag: '🇵🇦' },
  { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
  { name: 'Saint Kitts and Nevis', code: 'KN', flag: '🇰🇳' },
  { name: 'Saint Lucia', code: 'LC', flag: '🇱🇨' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', flag: '🇻🇨' },
  { name: 'Samoa', code: 'WS', flag: '🇼🇸' },
  { name: 'San Marino', code: 'SM', flag: '🇸🇲' },
  { name: 'São Tomé and Príncipe', code: 'ST', flag: '🇸🇹' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
  { name: 'Seychelles', code: 'SC', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧' },
  { name: 'Somalia', code: 'SO', flag: '🇸🇴' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'South Sudan', code: 'SS', flag: '🇸🇸' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' },
  { name: 'Sudan', code: 'SD', flag: '🇸🇩' },
  { name: 'Suriname', code: 'SR', flag: '🇸🇷' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Syria', code: 'SY', flag: '🇸🇾' },
  { name: 'Taiwan', code: 'TW', flag: '🇹🇼' },
  { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯' },
  { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Timor-Leste', code: 'TL', flag: '🇹🇱' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬' },
  { name: 'Tonga', code: 'TO', flag: '🇹🇴' },
  { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲' },
  { name: 'Tuvalu', code: 'TV', flag: '🇹🇻' },
  { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿' },
  { name: 'Vanuatu', code: 'VU', flag: '🇻🇺' },
  { name: 'Vatican City', code: 'VA', flag: '🇻🇦' },
  { name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { name: 'Yemen', code: 'YE', flag: '🇾🇪' },
  { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' }
];
export const timezones = [
  { name: 'Etc/UTC', code: 'UTC' },
  { name: 'Etc/GMT', code: 'GMT' },
  { name: 'America/New_York', code: 'EST' },
  { name: 'America/New_York', code: 'EDT' },
  { name: 'America/Chicago', code: 'CST' },
  { name: 'America/Chicago', code: 'CDT' },
  { name: 'America/Denver', code: 'MST' },
  { name: 'America/Denver', code: 'MDT' },
  { name: 'America/Los_Angeles', code: 'PST' },
  { name: 'America/Los_Angeles', code: 'PDT' },
  { name: 'America/Anchorage', code: 'AKST' },
  { name: 'America/Anchorage', code: 'AKDT' },
  { name: 'Pacific/Honolulu', code: 'HST' },
  { name: 'America/Halifax', code: 'AST' },
  { name: 'America/Halifax', code: 'ADT' },
  { name: 'America/St_Johns', code: 'NST' },
  { name: 'America/St_Johns', code: 'NDT' },
  { name: 'America/Argentina/Buenos_Aires', code: 'ART' },
  { name: 'America/La_Paz', code: 'BOT' },
  { name: 'America/Sao_Paulo', code: 'BRT' },
  { name: 'America/Santiago', code: 'CLT' },
  { name: 'America/Bogota', code: 'COT' },
  { name: 'America/Guayaquil', code: 'ECT' },
  { name: 'Atlantic/Stanley', code: 'FKT' },
  { name: 'America/Cayenne', code: 'GFT' },
  { name: 'America/Guyana', code: 'GYT' },
  { name: 'America/Asuncion', code: 'PYT' },
  { name: 'America/Lima', code: 'PET' },
  { name: 'America/Paramaribo', code: 'SRT' },
  { name: 'America/Montevideo', code: 'UYT' },
  { name: 'America/Caracas', code: 'VET' },
  { name: 'Europe/London', code: 'BST' },
  { name: 'Europe/Berlin', code: 'CET' },
  { name: 'Europe/Berlin', code: 'CEST' },
  { name: 'Europe/Athens', code: 'EET' },
  { name: 'Europe/Athens', code: 'EEST' },
  { name: 'Europe/Lisbon', code: 'WET' },
  { name: 'Europe/Lisbon', code: 'WEST' },
  { name: 'Europe/Moscow', code: 'MSK' },
  { name: 'Asia/Kolkata', code: 'IST' },
  { name: 'Asia/Tokyo', code: 'JST' },
  { name: 'Asia/Seoul', code: 'KST' },
  { name: 'Asia/Jakarta', code: 'WIB' },
  { name: 'Asia/Makassar', code: 'WITA' },
  { name: 'Asia/Jayapura', code: 'WIT' },
  { name: 'Asia/Kuala_Lumpur', code: 'MYT' },
  { name: 'Asia/Singapore', code: 'SGT' },
  { name: 'Asia/Bangkok', code: 'THA' },
  { name: 'Asia/Ho_Chi_Minh', code: 'VST' },
  { name: 'Asia/Karachi', code: 'PKT' },
  { name: 'Asia/Kathmandu', code: 'NPT' },
  { name: 'Asia/Colombo', code: 'SLST' },
  { name: 'Asia/Yangon', code: 'MMT' },
  { name: 'Asia/Bangkok', code: 'ICT' },
  { name: 'Asia/Hong_Kong', code: 'HKT' },
  { name: 'Asia/Taipei', code: 'TST' },
  { name: 'Asia/Ulaanbaatar', code: 'ULAT' },
  { name: 'Asia/Almaty', code: 'ALMT' },
  { name: 'Asia/Tashkent', code: 'UZT' },
  { name: 'Asia/Ashgabat', code: 'TMT' },
  { name: 'Asia/Dushanbe', code: 'TJT' },
  { name: 'Asia/Bishkek', code: 'KGT' },
  { name: 'Asia/Kabul', code: 'AFT' },
  { name: 'Asia/Tehran', code: 'IRST' },
  { name: 'Asia/Dubai', code: 'GST' },
  { name: 'Asia/Baku', code: 'AZT' },
  { name: 'Asia/Yerevan', code: 'AMT' },
  { name: 'Asia/Tbilisi', code: 'GET' },
  { name: 'Europe/Istanbul', code: 'TRT' },
  { name: 'Africa/Lagos', code: 'WAT' },
  { name: 'Africa/Harare', code: 'CAT' },
  { name: 'Africa/Nairobi', code: 'EAT' },
  { name: 'Africa/Johannesburg', code: 'SAST' },
  { name: 'Australia/Sydney', code: 'AEST' },
  { name: 'Australia/Sydney', code: 'AEDT' },
  { name: 'Australia/Adelaide', code: 'ACST' },
  { name: 'Australia/Adelaide', code: 'ACDT' },
  { name: 'Australia/Perth', code: 'AWST' },
  { name: 'Pacific/Auckland', code: 'NZST' },
  { name: 'Pacific/Auckland', code: 'NZDT' },
  { name: 'Pacific/Fiji', code: 'FJT' },
  { name: 'Pacific/Tongatapu', code: 'TOT' },
  { name: 'Pacific/Apia', code: 'SST' },
  { name: 'Pacific/Efate', code: 'VUT' },
  { name: 'Pacific/Guadalcanal', code: 'SBT' },
  { name: 'Pacific/Port_Moresby', code: 'PGT' },
  { name: 'Pacific/Palau', code: 'PWT' },
  { name: 'Pacific/Nauru', code: 'NRT' },
  { name: 'Pacific/Majuro', code: 'MHT' },
  { name: 'Pacific/Tarawa', code: 'GILT' },
  { name: 'Pacific/Rarotonga', code: 'CKT' },
  { name: 'Pacific/Tahiti', code: 'TAHT' },
  { name: 'Pacific/Marquesas', code: 'MART' },
  { name: 'Pacific/Gambier', code: 'GAMT' },
  { name: 'Atlantic/Azores', code: 'AZOT' },
  { name: 'Atlantic/Cape_Verde', code: 'CVT' },
  { name: 'Antarctica/Casey', code: 'CAST' },
  { name: 'Pacific/Chatham', code: 'CHAST' },
  { name: 'Pacific/Chatham', code: 'CHADT' },
  { name: 'Australia/Lord_Howe', code: 'LHST' },
  { name: 'Australia/Lord_Howe', code: 'LHDT' },
  { name: 'Pacific/Norfolk', code: 'NFT' }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    first_name: 'Aarav',
    last_name: 'Sharma',
    email: 'aarav.sharma@email.com',
    phone: '+91-9876543210',
    avatar: '/placeholder.svg',
    roles: ['student'],
    status: 'Active',
    ageType: 'kid',
    gender: 'male',
    country: 'India',
    countryFlag: '🇮🇳',
    timezone: 'IST',
    bio: 'Passionate about learning classical dance forms',
    joinedDate: '2024-01-15',
    lastActive: '2024-01-20 10:30 AM',
    familyId: 'family_1',
    parentName: 'Raj Sharma',
    courses: ['Classical Bharatanatyam', 'Folk Dance'],
    classesAttended: 24,
    credits: 8,
    nextClass: 'Tomorrow 4:00 PM',
    creditBalance: 150,
    familyMembers: ['1', '4'],
    lastActivity: '2024-01-20 10:30 AM'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    first_name: 'Emma',
    last_name: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1-555-0123',
    avatar: '/placeholder.svg',
    roles: ['student'],
    status: 'Active',
    ageType: 'adult',
    gender: 'female',
    country: 'United States',
    countryFlag: '🇺🇸',
    timezone: 'EST',
    bio: 'Adult learner interested in cultural dance',
    joinedDate: '2024-02-01',
    lastActive: '2024-01-19 2:15 PM',
    courses: ['Contemporary Dance'],
    classesAttended: 12,
    credits: 5,
    nextClass: 'Friday 6:00 PM',
    creditBalance: 200,
    lastActivity: '2024-01-19 2:15 PM'
  },
  {
    id: '3',
    name: 'Priya Patel',
    first_name: 'Priya',
    last_name: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+91-9876543211',
    avatar: '/placeholder.svg',
    roles: ['instructor'],
    status: 'Active',
    ageType: 'adult',
    gender: 'female',
    country: 'India',
    countryFlag: '🇮🇳',
    timezone: 'IST',
    bio: 'Certified instructor with 10+ years experience',
    joinedDate: '2023-08-10',
    lastActive: '2024-01-20 9:00 AM',
    courses: ['Classical Bharatanatyam', 'Kathak'],
    creditBalance: 500,
    lastActivity: '2024-01-20 9:00 AM'
  },
  {
    id: '4',
    name: 'Michael Chen',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0124',
    avatar: '/placeholder.svg',
    roles: ['parent'],
    status: 'Active',
    ageType: 'adult',
    gender: 'male',
    country: 'Canada',
    countryFlag: '🇨🇦',
    timezone: 'EST',
    bio: 'Parent of two dance students',
    joinedDate: '2024-01-05',
    lastActive: '2024-01-18 7:30 PM',
    familyId: 'family_2',
    creditBalance: 300,
    familyMembers: ['1', '4'],
    lastActivity: '2024-01-18 7:30 PM'
  },
  {
    id: '5',
    name: 'Sarah Williams',
    first_name: 'Sarah',
    last_name: 'Williams',
    email: 'sarah.williams@email.com',
    phone: '+44-20-7946-0958',
    avatar: '/placeholder.svg',
    roles: ['admin'],
    status: 'Active',
    ageType: 'adult',
    gender: 'female',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    timezone: 'GMT',
    bio: 'Platform administrator',
    joinedDate: '2023-06-01',
    lastActive: '2024-01-20 11:45 AM',
    creditBalance: 0,
    lastActivity: '2024-01-20 11:45 AM'
  },
  {
    id: '6',
    name: 'Kiran Devi',
    first_name: 'Kiran',
    last_name: 'Devi',
    email: 'kiran.devi@email.com',
    phone: '+91-9876543212',
    avatar: '/placeholder.svg',
    roles: ['student'],
    status: 'Inactive',
    ageType: 'kid',
    gender: 'female',
    country: 'India',
    countryFlag: '🇮🇳',
    timezone: 'IST',
    bio: 'Taking a break from classes',
    joinedDate: '2023-12-01',
    lastActive: '2024-01-10 3:20 PM',
    familyId: 'family_3',
    parentName: 'Sunita Devi',
    courses: ['Folk Dance'],
    classesAttended: 8,
    credits: 2,
    nextClass: 'On hold',
    creditBalance: 75,
    familyMembers: ['6'],
    lastActivity: '2024-01-10 3:20 PM'
  },
  {
    id: '7',
    name: 'David Thompson',
    first_name: 'David',
    last_name: 'Thompson',
    email: 'david.thompson@email.com',
    phone: '+1-555-0125',
    avatar: '/placeholder.svg',
    roles: ['support'],
    status: 'Active',
    ageType: 'adult',
    gender: 'male',
    country: 'United States',
    countryFlag: '🇺🇸',
    timezone: 'PST',
    bio: 'Customer support specialist',
    joinedDate: '2023-09-15',
    lastActive: '2024-01-19 4:45 PM',
    creditBalance: 0,
    lastActivity: '2024-01-19 4:45 PM'
  }
]
