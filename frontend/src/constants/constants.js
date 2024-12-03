export const DataTableCustomStyles = {
  rows: {
    style: {
      minHeight: '45px', // override the row height
    },
  },
  headCells: {
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      color: '#000000',
      fontSize: '13px'

    },
  },
  cells: {
    style: {
      fontSize: '12px',
      // border:'1px solid #EBECEC',

    },
  },
  table: {
    style: {
      border: '1px solid #dee2e6',

    },
  },

  pagination: {
    style: {
      fontSize: '14px',
      color: '#4E6B7C',
      fontWeight: '450',
      border: '1px solid #dee2e6',

    },
  },
  expanderCell: {
    style: {
      flex: '0 0 48px',
    },
  },

};

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const mobileRegExp = /^(\d{10})?$/;

export const mobileReg = /^\d{10,15}$/;

export const urlRegExp = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;


// Master Data

export const COUNTRY_LIST = ['INDIA','MALAYSIA','USA','AUSTRALIA','SRILANKA','SINGAPORE',];

export const STATE_LIST = ['தமிழ்நாடு','OTHERS'];

export const CAST_lIST = ['மணியன்','காடை','வெண்டுவன்']

export const DISTRICT_LIST = ['அரியலூர்', 'ஈரோடு', 'உதகமண்டலம்', 'கடலூர்', 'கரூர்', 'கள்ளக்குறிச்சி', 'காஞ்சிபுரம்', 'கிருஷ்ணகிரி', 'கோயம்புத்தூர்', 'சிவகங்கை',
  'செங்கல்பட்டு', 'சென்னை', 'சேலம்', 'தஞ்சாவூர்', 'தர்மபுரி', 'திண்டுக்கல்', 'திருச்சி', 'திருநெல்வேலி', 'திருப்பத்தூர்', 'திருப்பூர்', 'திருவண்ணாமலை',
  'திருவள்ளூர்', 'திருவாரூர்2', 'தூத்துக்குடி', 'தென்காசி', 'தேனி', 'நாகப்படடினம்', 'நாகர்கோயில்', 'நாமக்கல்', 'புதுக்கோட்டை', 'பெரம்பலூர்',
  'மதுரை', 'மயிலாடுதுறை', 'ராணிப்பேட்டை', 'ராமநாதபுரம்', 'விருதுநகர்', 'விழுப்புரம்', 'வேலூர்', 'OTHERS'];

export const RECEIPT_BOOK_NO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 
  86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
  125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150];

export const RELATIONSHIP = ["குடும்ப தலைவர்", "மனைவி", "கணவர்", "மகன்", "மகள்", "தாய்", "தந்தை", "தாத்தா", "ஆத்தா", "பேரன்", "பேத்தி", "மருமகள்"];

export const GENDER = ["ஆண்", "பெண்", "மூன்றாம் பாலினத்தவர்"];

export const OCCUPATION = ["விவசாயம் (ம) விவசாய சார் தொழில்", "சுய தொழில்", "நிறுவன பணியாளர்", "இல்லம்சார்ந்தவர்", "கல்வி பயில்பவர்", "ஓய்வு பெற்றவர்"];

export const MARTIAL_STATUS = ["தனியர் (அ) திருமணமாகாதவர்", "திருமணமானவர்", "விதவை (அ) கைவிடப்பட்டவர் (அ) விவாகரத்தானவர்"];