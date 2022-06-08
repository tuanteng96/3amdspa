import React, { useEffect, useRef } from "react";

function ReportRender({f7}) {
    const elmRef = useRef();
    
    useEffect(() => {
      f7.dialog.preloader('Đang tải báo cáo...')
        if (elmRef.current) {
            window.RenderReport && window.RenderReport(elmRef.current, onHideLoad);
        }
        
    }, [elmRef]);

    const onHideLoad = () => {
      f7.dialog.close()
    }

  return (
    <div id="elm-report" className="h-100" ref={elmRef}></div>
  );
}

export default ReportRender;
