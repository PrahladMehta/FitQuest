import Feather from 'react-native-vector-icons/Feather';

export type IconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'plus'
  | 'x'
  | 'calendar'
  | 'lock'
  | 'trash-2'
  | 'edit-2';

type Props = {
  name: IconName;
  color?: string;
  size?: number;
};

export default function Icon({ name, color = '#FFFFFF', size = 18 }: Props) {
  return <Feather name={name} color={color} size={size} />;
}
