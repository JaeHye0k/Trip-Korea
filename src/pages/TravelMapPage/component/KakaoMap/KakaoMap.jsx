import React, { useEffect, useState } from "react";
import "./KakaoMap.style.css";
import { getCurrentMapArea } from "../../../../utils/kakaoMap/getCurrentMapArea";
import { getCurrentLocaition } from "../../../../utils/kakaoMap/getCurrentLocation";
import { useSelector, useDispatch } from "react-redux";
import {
	selectCode,
	setWeather,
	setCenter,
	setContentType,
} from "../../../../redux/TravelMapStore/kakaoMapSlice";
import { fetchContentType } from "../../../../utils/tourApi/tourApi";
import { useQuery } from "@tanstack/react-query";

const { kakao } = window;
const baseUrl = `https://dapi.kakao.com/v2/local`;

// latitude = 위도 (0 ~ 90) y축
// longitude = 경도 (0 ~ 180) x축

const categoryMarkers = [];
let listenerFlag = false;
export let clickedLocation = null;
let currentLocation = null;

const KakaoMap = () => {
	const selectedCode = useSelector((state) => state.kakaoMap.selectedCode);
	const [map, setMap] = useState(null);
	const dispatch = useDispatch();
	const contentType = useSelector((state) => state.kakaoMap.contentType);
	const { data } = useQuery({
		queryKey: ["category-type"],
		queryFn: () => fetchContentType(),
		enabled: !Object.keys(contentType).length,
		refetchOnReconnect: false,
	});

	// 카카오 맵 객체를 생성하는 함수입니다
	const getKakaoMap = ({ lat, lng }) => {
		const container = document.getElementById("kakao-map"); //지도를 담을 영역의 DOM 레퍼런스
		const options = {
			//지도를 생성할 때 필요한 기본 옵션
			center: new kakao.maps.LatLng(lat, lng), //지도의 중심좌표.
			level: 3, //지도의 레벨(확대, 축소 정도)
		};
		const map =
			kakao && kakao.maps ? new kakao.maps.Map(container, options) : null;
		return map;
	};

	const getCurrentWeather = async () => {
		if (clickedLocation === null) return null;
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${
			clickedLocation.lat
		}&lon=${clickedLocation.lng}&appid=${
			import.meta.env.VITE_WEATHER_API_KEY
		}&units=metric`;
		const response = await fetch(url);
		const data = await response.json();
		return data;
	};
	// 현재 지도의 사각형 영역내에서 해당되는 카테고리 데이터를 호출하는 함수입니다
	const searchByCategory = async () => {
		if (selectedCode === null) return null;
		const rect = getCurrentMapArea(map).join(","); // 지도의 사각형 영역 구하기
		const url = `${baseUrl}/search/category?category_group_code=${selectedCode}&rect=${rect}`;
		const response = await fetch(url, {
			headers: {
				Authorization: `KakaoAK ${
					import.meta.env.VITE_KAKAO_API_KEY_REST
				}`,
			},
		});
		const data = await response.json();
		return data;
	};

	// 마커를 생성하고 해당 위치에 표시하는 함수입니다
	const showMarker = ({ lat, lng }) => {
		// 마커를 표시할 위치
		const markerPostiion = new kakao.maps.LatLng(lat, lng);
		// 마커 생성
		const marker = new kakao.maps.Marker({
			position: markerPostiion,
		});

		categoryMarkers.push(marker);
		marker.setMap(map);
	};

	// 이전까지의 마커를 지우는 함수입니다
	const clearMarkers = () => {
		if (categoryMarkers.length > 0) {
			categoryMarkers.forEach((marker) => {
				marker.setMap(null);
			});
		}
		categoryMarkers.length = 0;
	};

	// 지도 드래그 핸들러
	const updateMarkers = async () => {
		if (selectedCode === null) return null;
		const categorizedData = await searchByCategory();
		clearMarkers();
		categorizedData?.documents.forEach(({ x, y }) => {
			showMarker({ lat: y, lng: x });
		});
	};

	// 지도를 클릭했을 때 마커를 생성하는 함수입니다
	const markByClick = async (e) => {
		// 클릭한 곳의 위도, 경도 정보를 가져옴
		const latlng = e.latLng;
		const location = {
			lat: latlng.getLat(),
			lng: latlng.getLng(),
		};
		// 이전 마커 지우기
		clearMarkers();
		showMarker(location);
		clickedLocation = location;
		const weather = await getCurrentWeather();
		dispatch(setWeather({ weather }));
		dispatch(selectCode({ categoryCode: null }));
		dispatch(setCenter(location));
	};

	// 페이지에 처음 들어왔을 때 실행됩니다
	useEffect(() => {
		const showKakaoMap = async () => {
			const location = await getCurrentLocaition();
			// kakao map 객체 생성
			const map = getKakaoMap(location);
			// 마커 생성
			const markerPostiion = new kakao.maps.LatLng(
				location.lat,
				location.lng
			);
			const marker = new kakao.maps.Marker({
				position: markerPostiion,
			});
			categoryMarkers.push(marker);
			marker.setMap(map);
			// 지도 클릭시 마커 생성
			kakao.maps.event.addListener(map, "click", async (e) => {
				const latlng = e.latLng;
				const location = {
					lat: latlng.getLat(),
					lng: latlng.getLng(),
				};
				const markerPostiion = new kakao.maps.LatLng(
					location.lat,
					location.lng
				);
				const marker = new kakao.maps.Marker({
					position: markerPostiion,
				});
				clearMarkers();
				clickedLocation = location;
				const weather = await getCurrentWeather();
				dispatch(setWeather({ weather }));
				dispatch(setCenter(location));
				categoryMarkers.push(marker);
				marker.setMap(map);
			});
			setMap(map);
			currentLocation = location;
			clickedLocation = location;
			const centerLocation = {
				lat: map.getCenter().getLat(),
				lng: map.getCenter().getLng(),
			};
			dispatch(setCenter(centerLocation));
		};
		showKakaoMap();
	}, []);

	// 카테고리 코드가 변경될 때 마다 실행됩니다
	useEffect(() => {
		const showKakaoMap = async () => {
			if (map !== null) {
				if (selectedCode !== null) {
					const categorizedData = await searchByCategory();
					// 이전 마커 지우기
					clearMarkers();
					// 현재 선택한 카테고리에 해당되는 위치에 마커 표시
					categorizedData?.documents.forEach(({ x, y }) => {
						showMarker({ lat: y, lng: x });
					});
				}
				// 지도 이동시 마커 갱신
				kakao.maps.event.addListener(map, "dragend", updateMarkers);
				// 지도 클릭시 마커 생성
				kakao.maps.event.addListener(map, "click", markByClick);
				listenerFlag = true;
			}
		};
		if (currentLocation) {
			showKakaoMap();
		}
		return () => {
			if (listenerFlag) {
				kakao.maps.event.removeListener(map, "dragend", updateMarkers);
				kakao.maps.event.removeListener(map, "click", markByClick);
			}
		};
	}, [selectedCode]);
	useEffect(() => {
		if (data) {
			data?.response?.body.items.item.map(({ code, name }) => {
				dispatch(setContentType({ code, name }));
			});
		}
	}, [data]);

	return <div id="kakao-map"></div>;
};

export default KakaoMap;
