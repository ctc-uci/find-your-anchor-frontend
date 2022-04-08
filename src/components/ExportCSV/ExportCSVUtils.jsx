export default function renameProperty(property) {
  switch (property) {
    case 'date':
      return 'Date';
    case 'box_id':
      return 'Box #';
    case 'zip_code':
      return 'Zip Code';
    case 'picture':
      return 'Image';
    case 'general_location':
      return 'Landmarks';
    case 'launched_organically':
      return 'Launched Organically';
    case 'message':
      return 'Message';
    default:
      return '';
  }
}
