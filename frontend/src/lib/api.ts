// src/lib/api.ts
import { API_URL } from "./constants";

// Generic fetcher for SWR or any fetch calls
export const fetcher = async (url: string) => {
  const res = await fetch(`${API_URL}${url}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// -------------------------------
// Reviews API (global)
// -------------------------------
export const reviewsAPI = {
  async list() {
    const res = await fetch(`${API_URL}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },
};

// -------------------------------
// Properties API
// -------------------------------
export const propertiesAPI = {
  async list() {
    const res = await fetch(`${API_URL}/properties`);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return res.json();
  },

  async getProperty(slug: string) {
    const res = await fetch(`${API_URL}/properties/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch property");
    return res.json();
  },

  async getReviews(slug: string) {
    const res = await fetch(`${API_URL}/properties/${slug}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch property reviews");
    return res.json();
  },

  async getStats(slug: string) {
    const res = await fetch(`${API_URL}/properties/${slug}/stats`);
    if (!res.ok) throw new Error("Failed to fetch property stats");
    return res.json();
  },
};

// -------------------------------
// Analytics API (global)
// -------------------------------
export const analyticsAPI = {
  async fetchAnalytics() {
    const res = await fetch(`${API_URL}/reviews/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },
};

// -------------------------------
// Google API
// -------------------------------
export const googleAPI = {
  async searchPlace(query: string) {
    const res = await fetch(`${API_URL}/google/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to search place");
    return res.json();
  },

  async getReviews(placeId: string) {
    const res = await fetch(`${API_URL}/google/reviews/${placeId}`);
    if (!res.ok) throw new Error("Failed to load Google reviews");
    return res.json();
  },
};
