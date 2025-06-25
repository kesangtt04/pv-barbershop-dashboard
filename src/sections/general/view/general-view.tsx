/* eslint-disable perfectionist/sort-imports */
import { DashboardContent } from 'src/layouts/dashboard';
import Timetable from '../timetable';

export function GeneralView() {
  return (
    <DashboardContent>
      <Timetable />
    </DashboardContent>
  );
}
