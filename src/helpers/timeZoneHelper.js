import moment from 'moment-timezone';

export const timeFormatter = (date) => moment(date).utc().format('DD MMM YYYY - hh:mm a');