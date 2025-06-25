/* eslint-disable perfectionist/sort-imports */
import { DashboardContent } from 'src/layouts/dashboard';
import Timetable from '../timetable';

export function TodayScheduleView() {
  return (
    <DashboardContent>
      <Timetable />
    </DashboardContent>
  );
}
