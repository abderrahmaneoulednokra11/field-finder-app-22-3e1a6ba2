import stadium1 from "@/assets/stadium-1.jpg";
import stadium2 from "@/assets/stadium-2.jpg";
import stadium3 from "@/assets/stadium-3.jpg";
import stadium4 from "@/assets/stadium-4.jpg";
import stadium5 from "@/assets/stadium-5.jpg";
import stadium6 from "@/assets/stadium-6.jpg";

export const stadiumImages = {
  "b9ea8fb9-59d7-44bf-81c8-52668c28d9a1": [stadium1, stadium5, stadium3],
  "8df1c7bc-bf6d-4d98-8f59-a7dac285c369": [stadium2, stadium6, stadium4],
  "9eaafeda-032a-40f7-a934-1f4ab5120e70": [stadium3, stadium1, stadium6],
  "519698d2-6111-4011-b929-10088bf48ad3": [stadium4, stadium2, stadium5],
  "c1266eb2-a124-4786-b244-ab5a834f09ec": [stadium5, stadium3, stadium1],
  "29ea0f54-f444-4297-923d-4170c7c29f34": [stadium6, stadium4, stadium2],
};

export function getStadiumImages(stadiumId) {
  return stadiumImages[stadiumId] || [stadium1, stadium2, stadium3];
}

export function getStadiumMainImage(stadiumId) {
  return stadiumImages[stadiumId]?.[0] || stadium1;
}
