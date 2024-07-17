import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./AttractionDetailPage.style.css";
import { useNavigate } from "react-router-dom";
import { useDetail } from "../../hooks/useAttractionDetail";

const AttractionsDetailPage = () => {
  let { contentId } = useParams();
  const { data } = useDetail({ contentId });
  const [contentTypeId, setContentTypeId] = useState("");
  const detailData = data?.response.body.items.item[0];
  const navigate = useNavigate();

  useEffect(() => {
    if (detailData) {
      setContentTypeId(detailData?.contenttypeid);
    }
  }, [detailData]);

  return (
    <div className="att-container">
      <div className="att-detail-container">
        <div className="att-flex-box">
          <div className="img-box">
            <img src={detailData?.firstimage} />
          </div>

          <div className="detail-info-box">
            <h3>{detailData?.title}</h3>
            <div className="info-text-box">
              <div className="title-box">
                <div className="att-title">우편번호</div>
                <div className="att-article">{detailData?.zipcode}</div>
              </div>
              <div className="title-box">
                <div className="att-title">제목</div>
                <div className="att-article">{detailData?.title}</div>
              </div>
              <div className="title-box">
                <div className="att-title">주소</div>
                <div className="att-article">{detailData?.addr1}</div>
              </div>
            </div>
            <div className="content-article">{detailData?.overview}</div>
          </div>
        </div>
        <button className="nav-btn" onClick={() => navigate("/attractions")}>
          목록
        </button>
      </div>
    </div>
  );
};

export default AttractionsDetailPage;
