import dayjs from 'dayjs';

const TIME_STYLE = 'hh:mm';
const DATE_STYLE = 'YYYY-MM-DD';
const DATE_TIME_STYLE = 'DD/MM/YY hh:mm';

const humanReadableDueDate = (date) => dayjs(date).format('DD MMM');
const formatValue = (value) => (value < 10) ? `0${value}` : `${value}`;
const getDays = (days) => (days) ? `${formatValue(days)}D` : '';
const getHours = (days, restHours) => (days || restHours) ? `${formatValue(restHours)}H` : '';
const getMinutes = (restMinutes) => (restMinutes < 10) ? `0${restMinutes}M` : `${restMinutes}M`;

const duration = (dateFrom, dateTo) => {
  const DAY_MINUTES_COUNT = 1440;
  const HOUR_MINUTES_COUNT = 60;

  const difference = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(difference / DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference % DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const restMinutes = difference % HOUR_MINUTES_COUNT;

  return `${getDays(days)} ${getHours(days, restHours)} ${getMinutes(restMinutes)}`;
};

const formatDate = (date, format) => dayjs(date).format(format);

const getDate = (date) => formatDate(date, DATE_STYLE);
const getTime = (date) => formatDate(date, TIME_STYLE);
const getDateTime = (date) => formatDate(date, DATE_TIME_STYLE);

const isPointDateLast = (date) => dayjs().diff(date, 'day') > 0;
const isPointDateFuture = (date) => date.diff(dayjs(), 'day') >= 0;
const isPointDateFutureLast = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'day') > 0 && dateTo.diff(dayjs(), 'day') > 0;

export { humanReadableDueDate, duration, getDate, getDateTime, getTime, isPointDateLast, isPointDateFuture, isPointDateFutureLast };
