import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getRelativeTime = (date: Date | null) => {
  return dayjs(date).fromNow();
};

// export const formatDate = ({ date = null, fmt = '' }) => {
//   return dayjs(date).format(fmt);
// };

export const formatDate = ({
  date = null,
  fmt = '',
}: {
  date: Date | null | string;
  fmt: string;
}): string => {
  return date ? dayjs(date).format(fmt) : '';
};
