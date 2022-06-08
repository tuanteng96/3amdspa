import React, { useEffect, useRef } from "react";

function ReportRender(props) {
    const elmRef = useRef();
    
    useEffect(() => {
        if (elmRef.current) {
            window.RenderReport && window.RenderReport(elmRef.current);
        }
    }, [elmRef]);

  return (
    <div id="elm-report" className="h-100" ref={elmRef}>
      Đang tải
    </div>
  );
}

export default ReportRender;
