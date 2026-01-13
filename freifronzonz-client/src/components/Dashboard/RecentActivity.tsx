"use client";

import { useGetRecentActivityQuery } from "@/redux/service/admin/dashboardApi";

// ─── SVG ICONS BASED ON ACTIVITY TYPE ─────────────────────
const getIconByType = (type: string) => {
  switch (type) {
    case "PAYMENT":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
          <path
            d="M17 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V18L4.467 15.4C4.81319 15.1404 5.23426 15 5.667 15H17C17.5304 15 18.0391 14.7893 18.4142 14.4142C18.7893 14.0391 19 13.5304 19 13V3C19 2.46957 18.7893 1.96086 18.4142 1.58579C18.0391 1.21071 17.5304 1 17 1Z"
            stroke="#595959"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ORDER":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M22.44 12.4575L20.19 7.2075C20.1326 7.07194 20.0365 6.95627 19.9138 6.87492C19.7911 6.79356 19.6472 6.75012 19.5 6.75H17.25V5.25C17.25 5.05109 17.171 4.86032 17.0303 4.71967C16.8897 4.57902 16.6989 4.5 16.5 4.5H2.25C2.05109 4.5 1.86032 4.57902 1.71967 4.71967C1.57902 4.86032 1.5 5.05109 1.5 5.25V18C1.5 18.1989 1.57902 18.3897 1.71967 18.5303C1.86032 18.671 2.05109 18.75 2.25 18.75H3.855C4.02771 19.3855 4.40475 19.9466 4.92795 20.3465C5.45114 20.7465 6.09142 20.9632 6.75 20.9632C7.40858 20.9632 8.04886 20.7465 8.57205 20.3465C9.09525 19.9466 9.47229 19.3855 9.645 18.75H14.355C14.5277 19.3855 14.9048 19.9466 15.4279 20.3465C15.9511 20.7465 16.5914 20.9632 17.25 20.9632C17.9086 20.9632 18.5489 20.7465 19.0721 20.3465C19.5952 19.9466 19.9723 19.3855 20.145 18.75H21.75C21.9489 18.75 22.1397 18.671 22.2803 18.5303C22.421 18.3897 22.5 18.1989 22.5 18V12.75C22.4998 12.6495 22.4794 12.55 22.44 12.4575ZM17.25 8.25H19.005L20.61 12H17.25V8.25ZM6.75 19.5C6.45333 19.5 6.16332 19.412 5.91665 19.2472C5.66997 19.0824 5.47771 18.8481 5.36418 18.574C5.25065 18.2999 5.22094 17.9983 5.27882 17.7074C5.3367 17.4164 5.47956 17.1491 5.68934 16.9393C5.89912 16.7296 6.16639 16.5867 6.45736 16.5288C6.74834 16.4709 7.04994 16.5006 7.32403 16.6142C7.59811 16.7277 7.83238 16.92 7.9972 17.1666C8.16203 17.4133 8.25 17.7033 8.25 18C8.25 18.3978 8.09196 18.7794 7.81066 19.0607C7.52936 19.342 7.14782 19.5 6.75 19.5ZM14.355 17.25H9.645C9.47229 16.6145 9.09525 16.0534 8.57205 15.6534C8.04886 15.2535 7.40858 15.0367 6.75 15.0367C6.09142 15.0367 5.45114 15.2535 4.92795 15.6534C4.40475 16.0534 4.02771 16.6145 3.855 17.25H3V6H15.75V15.42C15.4085 15.6182 15.1095 15.8819 14.8701 16.1959C14.6307 16.51 14.4556 16.8682 14.355 17.25ZM17.25 19.5C16.9533 19.5 16.6633 19.412 16.4166 19.2472C16.17 19.0824 15.9777 18.8481 15.8642 18.574C15.7506 18.2999 15.7209 17.9983 15.7788 17.7074C15.8367 17.4164 15.9796 17.1491 16.1893 16.9393C16.3991 16.7296 16.6664 16.5867 16.9574 16.5288C17.2483 16.4709 17.5499 16.5006 17.824 16.6142C18.0981 16.7277 18.3324 16.92 18.4972 17.1666C18.662 17.4133 18.75 17.7033 18.75 18C18.75 18.3978 18.592 18.7794 18.3107 19.0607C18.0294 19.342 17.6478 19.5 17.25 19.5ZM21 17.25H20.145C19.9791 16.6076 19.6051 16.0384 19.0812 15.6313C18.5574 15.2242 17.9134 15.0022 17.25 15V13.5H21V17.25Z"
            fill="#595959"
          />
        </svg>
      );
    case "USER":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z"
            stroke="#595959"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21"
            stroke="#595959"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 7H9M15 11H9M15 15H11M5 3H19V21L17.968 20.116C17.6055 19.8053 17.1439 19.6346 16.6665 19.6346C16.1891 19.6346 15.7275 19.8053 15.365 20.116L14.333 21L13.302 20.116C12.9395 19.8051 12.4776 19.6342 12 19.6342C11.5224 19.6342 11.0605 19.8051 10.698 20.116L9.667 21L8.635 20.116C8.27253 19.8053 7.81088 19.6346 7.3335 19.6346C6.85611 19.6346 6.39447 19.8053 6.032 20.116L5 21V3Z"
            stroke="#595959"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

// ─── TIME FORMATTING ──────────────────────────────────────
const formatTimeAgo = (isoString: string): string => {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""}`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""}`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""}`;
  return date.toLocaleDateString(); // fallback
};

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function RecentActivity() {
  const { data, isLoading, isError } = useGetRecentActivityQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <p className="text-red-500 text-sm">Failed to load activity.</p>
      </div>
    );
  }

  const activities = data.data; // Array of RecentActivityItem

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-start gap-3 py-2">
            {/* Icon */}
            <span className="text-gray-500 flex-shrink-0 mt-1">
              {getIconByType(activity.type)}
            </span>

            {/* Text */}
            <span className="flex-1 text-gray-700 text-sm leading-tight">
              {activity.text}
            </span>

            {/* Time */}
            <span className="text-xs text-amber-600 whitespace-nowrap">
              {formatTimeAgo(activity.time)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}