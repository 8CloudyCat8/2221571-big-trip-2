import dayjs from 'dayjs';

const DATE_STYLE = 'YYYY-MM-DD';
const DATE_TIME_STYLE = 'DD/MM/YY HH:mm';
const TIME_STYLE = 'HH:mm';
const HOUR_MINUTES = 60;
const TOTAL_DAY_MINUTES = 1440;

const getHoursOutput = (days, restHours) => ((days <= 0) && (restHours <= 0)) ? '' : `${`${restHours}`.padStart(2, '0')}H`;
const getMinutesOutput = (restMinutes) => `${`${restMinutes}`.padStart(2, '0')}M`;
const humanizePointDate = (date) => dayjs(date).format('DD MMM');
const getDaysOutput = (days) => (days <= 0) ? '' : `${`${days}`.padStart(2, '0')}D`;

const getDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const finish = dayjs(dateTo);
  const distinction = finish.diff(start, 'minute');
  const days = Math.trunc(distinction / TOTAL_DAY_MINUTES);
  const restHours = Math.trunc((distinction - days * TOTAL_DAY_MINUTES) / HOUR_MINUTES);
  const restMinutes = distinction - (days * TOTAL_DAY_MINUTES + restHours * HOUR_MINUTES);
  const daysOutput = getDaysOutput(days);
  const hoursOutput = getHoursOutput(days, restHours);
  const minutesOutput = getMinutesOutput(restMinutes);
  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};
const getDate = (date) => dayjs(date).format(DATE_STYLE);
const getTime = (date) => dayjs(date).format(TIME_STYLE);
const getDateTime = (date) => dayjs(date).format(DATE_TIME_STYLE);
const isPointDateOld = (dateTo) => dayjs().diff(dateTo, 'minute') > 0;
const isPointDateFuture = (dateFrom) => dayjs().diff(dateFrom, 'minute') <= 0;
const isPointDateFutureOld = (dateFrom, dateTo) => (dayjs().diff(dateFrom, 'minute') > 0) && (dayjs().diff(dateTo, 'minute') < 0);

export { humanizePointDate, getDuration, getDate, getDateTime, getTime, isPointDateOld, isPointDateFuture, isPointDateFutureOld };
