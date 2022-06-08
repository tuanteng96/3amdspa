import React from "react";
import { f7, Link, Navbar, Page, Toolbar } from "framework7-react";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";
import { getUser } from "../../../constants/user";
import { formatPriceVietnamese } from "../../../constants/format";
import staffService from "../../../service/staff.service";
import DatePicker from "react-mobile-datepicker";
import moment from "moment";
import "moment/locale/vi";
import SkeletonStatistical from "./skeleton/SkeletonStatistical";
moment.locale("vi");

export default class employeeStatistical extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isOpenDate: false,
      isDateCurrent: moment().format("DD/MM/YYYY"),
      monthCurrent: moment().format("MM/YYYY"),
    };
  }

  componentDidMount() {
    const month = moment().format("MM/YYYY");
    this.getSalary(month);
  }

  dateObject = (date) => {
    const dateMomentObject = moment(date, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
    return dateMomentObject.toDate();
  };

  numTotal = (arr) => {
    const initialValue = 0;
    if (!arr) return initialValue;
    let sum = arr.reduce(function (total, currentValue) {
      return total + currentValue.Value;
    }, initialValue);

    return sum;
  };

  SalaryServices = (dataSalary) => {
    const SalaryServices = dataSalary.filter((z) => {
      return !z.IsPending;
    });
    return this.numTotal(SalaryServices);
  };

  basicSalary = (dataSalary) => {
    let value = 0; //luong du kien
    value += dataSalary.UserSalaryConfig[0].Value;

    value += this.SalaryServices(dataSalary.SalaryServices);
    value += this.numTotal(dataSalary.BonusSales);
    value += this.numTotal(dataSalary.Bonus);
    value -= this.numTotal(dataSalary.NGAY_NGHI);
    value -= this.numTotal(dataSalary.PHAT);
    value += dataSalary.UserSalaryConfig[1].Value || 0;
    value += dataSalary?.THUONG_HOA_HONG_DOANH_SO?.Value || 0;
    return value;
  };

  totalDayOff = (arr) => {
    if (arr && arr.length > 0) {
      const initialValue = 0;
      let sum = arr.reduce(function (total, currentValue) {
        return total + currentValue.qty;
      }, initialValue);

      return sum;
    }
    return 0;
  };

  getSalary = (date) => {
    if (!getUser()) return false;
    const infoMember = getUser();
    const userID = infoMember.ID;
    staffService
      .getSalary(userID, date)
      .then((response) => {
        const result = response.data.data;
        setTimeout(() => {
          this.setState({
            dataSalary: result,
            isLoading: false,
          });
        }, 500);
      })
      .catch((error) => console.log(error));
  };

  handleDate = () => {
    this.setState({
      isOpenDate: true,
    });
  };

  handleSelectDate = async (date) => {
    const dateFull = moment(date).format("DD/MM/YYYY");
    const month = moment(date).format("MM/YYYY");
    f7.dialog.preloader(`Đang tải thống kê tháng ${month}`);
    this.setState({
      isOpenDate: false,
      isLoading: true,
      isDateCurrent: dateFull,
      monthCurrent: month,
    });
    const getSalary = await this.getSalary(month);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    f7.dialog.close();
    this.setState({
      isLoading: false,
    });
  };

  handleCancelDate = () => {
    this.setState({ isOpenDate: false });
  };

  async loadRefresh(done) {
    const { monthCurrent } = this.state;
    await this.getSalary(monthCurrent);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  // Thiếu DS_NGAY_NGHI, DOANH_SO

  render() {
    const { dataSalary, isLoading, isOpenDate, isDateCurrent, monthCurrent } =
      this.state;
    const dateConfig = {
      month: {
        caption: "Tháng",
        format: "M",
        step: 1,
      },
      year: {
        caption: "Năm",
        format: "YYYY",
        step: 1,
      },
    };
    return (
      <Page
        name="employee-statistical"
        onPtrRefresh={this.loadRefresh.bind(this)}
        ptr
        infiniteDistance={50}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.handleDate()}>
                <i className="las la-calendar"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                Thống Kê ({monthCurrent && monthCurrent})
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        {isLoading && <SkeletonStatistical />}
        {!isLoading && (
          <div className="page-render p-0">
            <div className="employee-statistical">
              {dataSalary && dataSalary.CHI_LUONG.length > 0 ? (
                <div className="employee-statistical__item">
                  <div className="title">Đã trả lương</div>
                  <div className="tfooter">
                    <div className="tr">
                      <div className="td">Đã trả</div>
                      <div className="td">
                        {dataSalary &&
                          formatPriceVietnamese(dataSalary?.CHI_LUONG[0].Value)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="employee-statistical__item">
                  <div className="title">Chưa trả lương</div>
                  <div className="tfooter">
                    <div className="tr">
                      <div className="td">Dự kiến</div>
                      <div className="td">
                        {dataSalary &&
                          formatPriceVietnamese(this.basicSalary(dataSalary))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="employee-statistical__item">
                <div className="title">Lương cơ bản</div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  <div className="tr">
                    <div className="td w-1">1</div>
                    <div className="td w-2">Lương cơ bản</div>
                    <div className="td w-3">
                      {dataSalary &&
                        formatPriceVietnamese(
                          dataSalary.UserSalaryConfig[0].Value
                        )}
                    </div>
                  </div>
                  <div className="tr">
                    <div className="td w-1">2</div>
                    <div className="td w-2">Ngày công yêu cầu</div>
                    <div className="td w-3">
                      {dataSalary.UserSalaryConfig[2].Value}
                    </div>
                  </div>
                  <div className="tr">
                    <div className="td w-1">3</div>
                    <div className="td w-2">Phụ cấp</div>
                    <div className="td w-3">
                      {dataSalary &&
                        formatPriceVietnamese(
                          dataSalary.UserSalaryConfig[1].Value
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="employee-statistical__item">
                <div className="title">Ngày nghỉ / Phạt</div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.PHAT.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">{item.Desc || "Phạt"}</div>
                        <div className="td w-3">
                          {formatPriceVietnamese(item.Value)}
                        </div>
                      </div>
                    ))}
                  {dataSalary &&
                    this.totalDayOff(dataSalary.DS_NGAY_NGHI) -
                      dataSalary.NGAY_NGHI_CHO_PHEP >
                      0 && (
                      <div className="tr">
                        <div className="td w-1">
                          {dataSalary.PHAT.length + 1}
                        </div>
                        <div className="td w-2">
                          Ngày nghỉ (
                          <span className="red">
                            {" "}
                            {this.totalDayOff(dataSalary.DS_NGAY_NGHI) -
                              dataSalary.NGAY_NGHI_CHO_PHEP}{" "}
                          </span>
                          ngày quá hạn )
                        </div>
                        <div className="td w-3">
                          {dataSalary &&
                            formatPriceVietnamese(
                              this.numTotal(dataSalary.NGAY_NGHI)
                            )}
                        </div>
                      </div>
                    )}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng phạt</div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(
                          this.numTotal(dataSalary.NGAY_NGHI) +
                            this.numTotal(dataSalary.PHAT)
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {dataSalary && dataSalary?.DS_NGAY_NGHI?.length > 0 && (
                <div className="employee-statistical__item">
                  <div className="title">Ngày nghỉ</div>
                  <div className="head">
                    <div className="tr">
                      <div className="td w-1">STT</div>
                      <div className="td w-2">Ngày</div>
                      <div className="td w-3">Số buổi</div>
                    </div>
                  </div>
                  <div className="tbody">
                    {dataSalary?.DS_NGAY_NGHI.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">
                          Từ ngày {moment(item.day).format("L")} đến ngày{" "}
                          {moment(item.day).add(item.qty, "days").format("L")}
                        </div>
                        <div className="td w-3">{item.qty} buổi</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="employee-statistical__item">
                <div className="title">
                  Lương dịch vụ (
                  <span>{dataSalary && dataSalary.SalaryServices.length}</span>)
                </div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.SalaryServices.map((item, index) => {
                      if (!item.IsPending)
                        return (
                          <div className="tr" key={index}>
                            <div className="td w-1">{index + 1}</div>
                            <div className="td w-2">
                              <span
                                className={`label-inline ${
                                  item.OSStatus === "done"
                                    ? "label-light-success"
                                    : "label-light-warning"
                                }`}
                              >
                                {item.OSStatus === "done"
                                  ? "Hoàn thành"
                                  : "Đang thực hiện"}
                              </span>
                              {item.ProdTitle} - ({" "}
                              {moment(item.CreateDate).format("llll")} )
                              <div>
                                {item?.Member?.FullName} -{" "}
                                {item?.Member?.MobilePhone}
                              </div>
                            </div>
                            <div className="td w-3">
                              {formatPriceVietnamese(item.Value)}
                            </div>
                          </div>
                        );
                    })}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng </div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(
                          this.SalaryServices(dataSalary.SalaryServices)
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="employee-statistical__item">
                <div className="title">
                  Hoa hồng bán hàng (
                  <span>
                    {(dataSalary && dataSalary.BonusSales?.length) || 0}
                  </span>
                  )
                </div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.BonusSales?.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">
                          Hoa hồng - ( {moment(item.CreateDate).format("llll")}{" "}
                          )<div>{item.ProdTitle}</div>
                        </div>
                        <div className="td w-3">
                          {formatPriceVietnamese(item.Value)}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng</div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(
                          this.numTotal(dataSalary.BonusSales)
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="employee-statistical__item">
                <div className="title">
                  Thưởng (<span>{dataSalary && dataSalary.Bonus.length}</span>)
                </div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.Bonus.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">
                          Thưởng - ( {moment(item.CreateDate).format("llll")} )
                        </div>
                        <div className="td w-3">
                          {formatPriceVietnamese(item.Value)}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng</div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(this.numTotal(dataSalary.Bonus))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="employee-statistical__item">
                <div className="title">
                  Tạm ứng (
                  <span>{dataSalary && dataSalary.TAM_UNG.length}</span>)
                </div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.TAM_UNG.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">
                          {item.Desc || "Tạm ứng"} - ({" "}
                          {moment(item.CreateDate).format("llll")} )
                        </div>
                        <div className="td w-3">
                          {formatPriceVietnamese(Math.abs(item.Value))}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng</div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(
                          Math.abs(this.numTotal(dataSalary.TAM_UNG))
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="employee-statistical__item">
                <div className="title">
                  Hoàn ứng (
                  <span>{dataSalary && dataSalary.THU_HOAN_UNG.length}</span>)
                </div>
                <div className="head">
                  <div className="tr">
                    <div className="td w-1">STT</div>
                    <div className="td w-2">Hạng mục</div>
                    <div className="td w-3">Giá trị</div>
                  </div>
                </div>
                <div className="tbody">
                  {dataSalary &&
                    dataSalary.THU_HOAN_UNG.map((item, index) => (
                      <div className="tr" key={index}>
                        <div className="td w-1">{index + 1}</div>
                        <div className="td w-2">
                          {item.Desc || "Hoàn ứng"} - ({" "}
                          {moment(item.CreateDate).format("llll")} )
                        </div>
                        <div className="td w-3">
                          {formatPriceVietnamese(item.Value)}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="tfooter">
                  <div className="tr">
                    <div className="td">Tổng</div>
                    <div className="td">
                      {dataSalary &&
                        formatPriceVietnamese(
                          this.numTotal(dataSalary.THU_HOAN_UNG)
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {dataSalary && dataSalary?.CHI_LUONG.length === 0 && (
                <div className="employee-statistical__item">
                  <div className="title">Lương của bạn</div>
                  <div className="tfooter">
                    <div className="tr">
                      <div className="td">Dự kiến</div>
                      <div className="td">
                        {dataSalary &&
                          formatPriceVietnamese(this.basicSalary(dataSalary))}
                      </div>
                    </div>
                    <div className="tr">
                      <div className="td">Lương thực nhận</div>
                      <div className="td">
                        {dataSalary &&
                          formatPriceVietnamese(
                            this.basicSalary(dataSalary) -
                              Math.abs(dataSalary.TON_TAM_UNG || 0)
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <DatePicker
          theme="ios"
          cancelText="Đóng"
          confirmText="Cập nhập"
          headerFormat="MM/YYYY"
          showCaption={true}
          dateConfig={dateConfig}
          value={isDateCurrent ? this.dateObject(isDateCurrent) : new Date()}
          isOpen={isOpenDate}
          onSelect={this.handleSelectDate}
          onCancel={this.handleCancelDate}
        />
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
