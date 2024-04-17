import React, { useEffect, useState } from "react";
import "./KakaoMap.style.css";
import { getCurrentMapArea } from "../../../../utils/getCurrentMapArea";
import { getCurrentLocaition } from "../../../../utils/getCurrentLocation";
import { useSelector } from "react-redux";

const { kakao } = window;
const baseUrl = `https://dapi.kakao.com/v2/local`;

const KakaoMap = () => {
  const selectedCode = useSelector((state) => state.kakaoMap.selectedCode);

  // 카카오 맵 객체를 생성하는 함수
  const getKakaoMap = ({ lat, lon }) => {
    const container = document.getElementById("kakao-map"); //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(lat, lon), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    return map;
  };

  // 카테고리를 기준으로 데이터를 호출하는 기능
  const searchByCategory = async (map) => {
    const rect = getCurrentMapArea(map).join(","); // 지도의 사각형 영역 구하기
    const categoryGroupCode = selectedCode;
    const url = `${baseUrl}/search/category?category_group_code=${categoryGroupCode}&rect=${rect}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY_REST}`,
      },
    });
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    const showKakaoMap = async () => {
      const location = await getCurrentLocaition();
      const map = getKakaoMap(location);
      searchByCategory(map);
    };
    showKakaoMap();
  }, [selectedCode]);
  return <div id="kakao-map" />;
};

export default KakaoMap;
