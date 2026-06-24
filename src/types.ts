export type ItemResponse = {
  id: number;
  title: string;
  description: string;
  location_ref: string;
  user: number;
  image: string;
  status: string;
};

export type ItemsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemResponse[];
};

export type Item = {
  id: number;
  title: string;
  img: string;
  description: string;
  location_ref: string | undefined;
  status: string;
  user: number;
  type: 'found' | 'lost';
  author?: string;
  created_at?: string;
  pickup_point_name?: string;
  pickup_point?: number | null;
};

export type ApiItem = {
  id: number;
  user: number;
  category: number | null;
  category_name?: string;
  pickup_point: number | null;
  pickup_point_name?: string;
  location_type: string;
  location_ref: string;
  description: string;
  status: string;
  image: string | null;
  created_at: string;
  author?: string;
};

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IssuanceHistoryItem {
  id: number;
  found_item: number;
  found_item_title: string;
  found_item_description?: string;
  found_item_image?: string | null;
  found_item_location?: string;
  found_item_author?: string;
  found_item_created_at?: string;

  pickup_point: number;
  pickup_point_name: string;

  user: number;
}

export interface PickupPointType {
  id: number;
  name: string;
}

export interface PickupPointResponse {
  id: number;
  name: string;
  building: number;
  building_name: string;
  location?: string;
}

export interface NotificationPayload {
  action_type: 'claim' | 'confirm';
  item_id: number;
  item_title: string;
  item_category: string;
  item_description: string;
  creator_name: string;
  creator_id: number;
  pickup_point_name: string;
}

export interface Notificationing extends NotificationPayload {
  id: number;
  action_time: string;
  is_read: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type NotificationsResponse = PaginatedResponse<Notificationing>;

export type SearchResult = {
  vector_id: string;
  item_id: string;
  distance: number;
};

export type AppealPayload = {
  subject: string;
  message: string;
  found_item?: number;
  lost_item?: number;
};

export type MyCardsProps = {
  items: Item[];
};