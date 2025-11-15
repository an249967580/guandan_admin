
import moment from 'moment';

export const strToTime = (dateStr) => {
    return new Date(dateStr).getTime();
}

export const timeToStr = (time,formats = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(time,"X").format(formats);
}