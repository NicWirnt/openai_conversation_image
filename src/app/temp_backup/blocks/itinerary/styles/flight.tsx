import { DatePicker } from "@/components/ui/datepicker";
import { DateTimePicker } from "@/components/ui/datetimepicker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDictionary } from "@/providers/DictionaryProvider";
import { useEditor } from "@/providers/stores/editor.provider";
import {
  MainSideBarType,
  SideBarType,
} from "@/providers/stores/editor/properties";
import {
  BookingData,
  SegmentActivityCI,
  SegmentBusCoachCI,
  SegmentCI,
  SegmentCarHireCI,
  SegmentCruiseCI,
  SegmentFerryCI,
  SegmentGeneralCI,
  SegmentHotelStayCI,
  SegmentInsuranceCI,
  SegmentMiscellaneousCI,
  SegmentOwnArrangementsCI,
  SegmentPackageCI,
  SegmentRailCI,
  SegmentSurfaceCI,
  SegmentTourCI,
  SegmentTransferCI,
} from "@/types/blocks/itineary";
import {
  faEdit,
  faPlaneDeparture,
  faUserGroup,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SegmentIcon, {
  SegmentType,
} from "../../../editorUIHelpers/itinerary/SegmentIcon";
import { formatDate, formatTime, getStartDate } from "../index";

type Props = {
  blockId: string;
  type:
    | "bookingDetails"
    | "flight"
    | "hotel"
    | "car"
    | "train"
    | "bus"
    | "cruise"
    | "ferry"
    | "activity"
    | "package"
    | "surface"
    | "tour"
    | "transfer"
    | "ownArrangement"
    | "insurance"
    | "miscellaneous";
  data?: SegmentCI | BookingData;
  parent: string;
  edit: boolean;
  showHideToolbar: (show: boolean) => void;
};
type NonFlightSegment =
  | SegmentHotelStayCI
  | SegmentCarHireCI
  | SegmentCruiseCI
  | SegmentOwnArrangementsCI
  | SegmentTransferCI
  | SegmentTourCI
  | SegmentBusCoachCI
  | SegmentFerryCI
  | SegmentRailCI
  | SegmentPackageCI
  | SegmentSurfaceCI
  | SegmentInsuranceCI
  | SegmentActivityCI
  | SegmentGeneralCI
  | SegmentMiscellaneousCI;

type SegmentRBCF =
  | SegmentRailCI
  | SegmentBusCoachCI
  | SegmentCruiseCI
  | SegmentFerryCI;

type SegmentAPS = SegmentActivityCI | SegmentPackageCI | SegmentSurfaceCI;

type SegmentAFSP =
  | SegmentActivityCI
  | SegmentFerryCI
  | SegmentSurfaceCI
  | SegmentPackageCI;
const Flight = ({
  blockId,
  type,
  data,
  parent,
  edit,
  showHideToolbar,
}: Props) => {
  const dict = useDictionary()((state) => state.dict);
  const updateBookingData = useEditor()((state) => state.updateBookingData);
  const updateSegmentDataAction = useEditor()(
    (state) => state.updateSegmentData,
  );
  const setSideBarContext = useEditor()((state) => state.setSideBarContext);

  const segmentData = data as SegmentCI;

  const sType = dict.itinerary[type]?.path;
  const currentDocument = useEditor()(
    (state) => state.documentList[state.currentVersion]!,
  );
  const bookingData = currentDocument.blocks[
    type === "bookingDetails" ? blockId : parent
  ].data.segmentData as BookingData;

  const [paxHoverIndex, setPaxHoverIndex] = useState<null | number>(null);

  const dateFormat = "dd MMM yyyy hh:mm a";

  return (
    <div
      onMouseEnter={(event) => {
        showHideToolbar(true);
      }}
      onMouseLeave={(event) => {
        showHideToolbar(false);
      }}
    >
      {type === "bookingDetails" && (
        <div className="booking-detail">
          <div className="title">
            <div className="booking-desc left ">
              <div className="title-text">
                <h1>{dict.itinerary.bookingDetails.nameTitle}</h1>
              </div>
            </div>
            <div className="booking-desc right ">
              <div className="title-text">
                <h1>{dict.itinerary.bookingDetails.title}</h1>
              </div>
            </div>
          </div>
          <div className="desc">
            <div className="booking-desc left clear-both">
              {data &&
                (data as BookingData).passengers?.passenger?.map((pax, i) => {
                  return (
                    <div
                      key={i}
                      className="desc-text mr-2 flex items-center rounded py-1 hover:bg-[#80808012]"
                      onMouseEnter={() => {
                        setPaxHoverIndex(i);
                      }}
                      onMouseLeave={() => {
                        setPaxHoverIndex(null);
                      }}
                    >
                      <span
                        className="flex-1 leading-[27.5px]"
                        onClick={() => {
                          setSideBarContext({
                            mainType: MainSideBarType.widget,
                            id: blockId,
                            type: SideBarType.passenger,
                            open: true,
                            block: {
                              id: blockId,
                              type: "itineraryBlock",
                              name: "Itinerary Block",
                              icon: (
                                <FontAwesomeIcon
                                  icon={faPlaneDeparture}
                                  className={" text-neutral-500"}
                                />
                              ),
                              passenger: pax,
                              passengerIndex: i,
                            },
                          });
                        }}
                      >
                        {pax.title ? pax.title : ""}{" "}
                        {pax.gender
                          ? (pax.gender.toUpperCase() == "MALE"
                              ? "MR"
                              : pax.gender.toUpperCase() == "FEMALE"
                                ? "MS"
                                : "") + "</span>"
                          : ""}
                        {pax.firstname} {pax.lastname || ""}
                      </span>
                      {paxHoverIndex === i && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="mr-1 w-fit cursor-pointer rounded px-2 py-1 hover:bg-neutral-200"
                                onClick={() => {
                                  setSideBarContext({
                                    mainType: MainSideBarType.widget,
                                    id: blockId,
                                    type: SideBarType.passenger,
                                    open: true,
                                    block: {
                                      id: blockId,
                                      type: "itineraryBlock",
                                      name: "Itinerary Block",
                                      icon: (
                                        <FontAwesomeIcon
                                          icon={faPlaneDeparture}
                                          className={" text-neutral-500"}
                                        />
                                      ),
                                      passenger: pax,
                                      passengerIndex: i,
                                      editPassenger: true,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  flip="horizontal"
                                  className={" mx-auto text-neutral-500"}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{dict.itinerary.bookingDetails.pax.edit}</p>
                            </TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  );
                })}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full px-2 py-1 hover:bg-neutral-200"
                    onClick={() => {
                      setSideBarContext({
                        mainType: MainSideBarType.widget,
                        id: blockId,
                        type: SideBarType.passenger,
                        open: true,
                        block: {
                          id: blockId,
                          type: "itineraryBlock",
                          name: "Itinerary Block",
                          icon: (
                            <FontAwesomeIcon
                              icon={faPlaneDeparture}
                              className={" text-neutral-500"}
                            />
                          ),
                        },
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      flip="horizontal"
                      className={" mx-auto text-neutral-500"}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dict.itinerary.bookingDetails.pax.paxs}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="booking-desc right ">
              <div className="desc-text flex items-center gap-2">
                <div className="desc-lbl">
                  {dict.itinerary.bookingDetails.date}:{" "}
                </div>
                <div className="desc-value segment-value flex-1">
                  <DatePicker
                    data={
                      new Date(
                        (data as BookingData).bookingStatus?.bookDate ??
                          Date.now(),
                      )
                    }
                    onSelect={(date) => {
                      updateBookingData({
                        blockId: blockId,
                        prop: "bookingStatus.bookDate",
                        value: date,
                      });
                    }}
                  ></DatePicker>
                </div>
              </div>
              <div className="desc-text mt-1 flex items-center gap-2">
                <div className="desc-lbl">
                  {dict.itinerary.bookingDetails.reference}:
                </div>
                <div className="desc-value segment-value flex-1">
                  <input
                    className="w-full"
                    type="text"
                    aria-label="Booking Reference"
                    placeholder="Booking Reference"
                    value={(data as BookingData)?.bookingReference ?? ""}
                    onChange={(e) => {
                      updateBookingData({
                        blockId: blockId,
                        prop: "bookingReference",
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="desc-text mt-1 flex items-center gap-2">
                <div className="desc-lbl">
                  {dict.itinerary.bookingDetails.orderDate}:
                </div>
                <div className="desc-value segment-value flex-1">
                  <DatePicker
                    data={
                      new Date(
                        (data as BookingData).bookingStatus?.orderedDate ??
                          Date.now(),
                      )
                    }
                    onSelect={(date) => {
                      updateBookingData({
                        blockId: blockId,
                        prop: "bookingStatus.orderedDate",
                        value: date,
                      });
                    }}
                  ></DatePicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {type !== "bookingDetails" && (
        <div className="segment">
          <div className="segment-detail">
            <table className="segment-table black">
              <tbody>
                <tr>
                  <td className="segment-main-date">
                    <span className="depart-heading-day">
                      {(
                        getStartDate(segmentData, type) ?? new Date()
                      )?.toLocaleDateString([], {
                        weekday: "short",
                      })}
                    </span>
                    <br />{" "}
                    <span className="depart-heading-month">
                      {(
                        getStartDate(segmentData, type) ?? new Date()
                      )?.toLocaleDateString([], {
                        month: "short",
                      })}
                    </span>
                    <br />{" "}
                    <span className="depart-heading-date">
                      {(
                        getStartDate(segmentData, type) ?? new Date()
                      )?.toLocaleDateString([], {
                        day: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="segment-main-container">
                    <table className="segment-inner-table location-table">
                      <tbody>
                        <tr>
                          <td className="segment-main-location flex items-center gap-1">
                            <SegmentIcon
                              type={type as SegmentType}
                              className="fa-xl"
                            />
                            <span className="mode-heading">
                              {dict.itinerary[type]?.heading}
                            </span>
                            {type !== "flight" &&
                              "note" in dict.itinerary[type] && (
                                <span className="mode-heading-subtext">
                                  <strong>
                                    <em>{dict.itinerary[type].note}</em>
                                  </strong>
                                </span>
                              )}
                            {type === "flight" &&
                              (edit ? (
                                <span className="segment-value ml-2 flex flex-1 items-center">
                                  <input
                                    className="flex-1"
                                    placeholder={dict.itinerary.flight.airport}
                                    value={
                                      segmentData?.flight?.departs?.airport
                                        ?.airportName ?? ""
                                    }
                                    onChange={(e) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: "flight.departs.airport.airportName",
                                        value: e.target.value,
                                      });
                                    }}
                                  ></input>
                                  <input
                                    className="ml-2 flex-1"
                                    placeholder={
                                      dict.itinerary.flight.departCity
                                    }
                                    value={
                                      segmentData?.flight?.departs?.airport
                                        ?.airportLocation?.cityName ?? ""
                                    }
                                    onChange={(e) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: "flight.departs.airport.airportLocation.cityName",
                                        value: e.target.value,
                                      });
                                    }}
                                  ></input>
                                </span>
                              ) : (
                                <span>
                                  {(segmentData?.flight?.departs?.airport
                                    ?.airportName ||
                                    segmentData?.flight?.departs?.airport
                                      ?.airportDetail) && (
                                    <>
                                      {segmentData?.flight?.departs?.airport
                                        ?.airportName
                                        ? segmentData?.flight?.departs?.airport
                                            ?.airportName
                                        : segmentData?.flight?.departs?.airport
                                            ?.airportDetail}{" "}
                                    </>
                                  )}
                                  {!segmentData?.flight?.departs?.airport
                                    ?.airportName &&
                                    segmentData?.flight?.departs?.airport
                                      ?.airportLocation?.cityName &&
                                    segmentData?.flight?.departs?.airport
                                      ?.airportLocation?.cityName}
                                </span>
                              ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="">
                      <table className="segment-inner-table w-full">
                        <thead>
                          <tr>
                            <td className="segment-title airline-ref-td-with-ref uppercase">
                              <div>
                                {dict.itinerary[type] &&
                                  dict.itinerary[type]["col-head"]}
                              </div>
                            </td>
                            <td className="segment-title booking-ref-td uppercase">
                              <div>
                                {dict.itinerary.bookingDetails.booking} #
                              </div>
                            </td>
                            <td className="segment-title depart-td uppercase">
                              <div>{dict.itinerary[type]?.start}</div>
                            </td>
                            <td className="segment-title arrive-td uppercase">
                              <div>{dict.itinerary[type]?.end}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              {type === "flight" &&
                                (edit ? (
                                  <span>
                                    <input
                                      className="mt-1 w-full placeholder:italic"
                                      placeholder={dict.itinerary.flight.mc}
                                      value={
                                        segmentData?.flight?.marketingCarrier
                                          ?.name ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.marketingCarrier.name",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <br />{" "}
                                    <input
                                      className="mt-1 w-full placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.equipment
                                      }
                                      value={
                                        segmentData?.flight?.equipment?.name ??
                                        ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.equipment.name",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1 w-full placeholder:italic"
                                      placeholder={dict.itinerary.flight.mcc}
                                      value={
                                        segmentData?.flight?.marketingCarrier
                                          ?.code ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.marketingCarrier.code",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1 w-full placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.flightNumber
                                      }
                                      value={
                                        segmentData?.flight?.flightNumber ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.flightNumber",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <br />
                                    <a
                                      className="mt-1 block"
                                      href="https://www.qantas.com/au/en/travel-info/check-in.html"
                                      target="_blank"
                                    >
                                      <span className="rounded-full border border-gray-900 px-2 text-[10px]">
                                        {dict.itinerary.flight.checkIn}
                                      </span>
                                    </a>
                                  </span>
                                ) : (
                                  <span>
                                    {segmentData?.flight?.marketingCarrier
                                      ?.name && (
                                      <span
                                        className="segment-supplier editable"
                                        data-path="flight.marketingCarrier.name"
                                      >
                                        {
                                          segmentData?.flight?.marketingCarrier
                                            ?.name
                                        }
                                      </span>
                                    )}
                                    <br />

                                    {segmentData?.flight?.equipment?.name && (
                                      <span
                                        className="editable"
                                        data-path="flight.equipment.name"
                                      >
                                        {segmentData?.flight?.equipment?.name}
                                      </span>
                                    )}

                                    {(segmentData?.flight?.marketingCarrier
                                      ?.code ||
                                      segmentData?.flight?.flightNumber) && (
                                      <>
                                        <span
                                          className="editable"
                                          data-path="flight.marketingCarrier.code"
                                        >
                                          {segmentData?.flight?.marketingCarrier
                                            ?.code || ""}
                                        </span>
                                        <span
                                          className="editable"
                                          data-path="flight.flightNumber"
                                        >
                                          {segmentData?.flight?.flightNumber ||
                                            ""}
                                        </span>
                                      </>
                                    )}

                                    {segmentData?.flight?.checkInUrl && (
                                      <>
                                        <br />
                                        <a
                                          href={segmentData?.flight?.checkInUrl}
                                          target="_blank"
                                        >
                                          <span className="rounded-full border border-gray-900 px-2 text-[10px]">
                                            {dict.itinerary.flight.checkIn}
                                          </span>
                                        </a>
                                      </>
                                    )}
                                  </span>
                                ))}

                              <span>
                                <span className="segment-supplier">
                                  {type !== "cruise" && type !== "flight" && (
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary[type]?.supplier
                                      }
                                      value={
                                        segmentData[
                                          dict.itinerary[type]?.path as
                                            | "car"
                                            | "hotel"
                                            | "rail"
                                            | "bus"
                                        ]?.supplier?.supplier?.supplierCode
                                          ?.name ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${dict.itinerary[type].path}.supplier.supplier.supplierCode.name`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  )}
                                  {type === "hotel" && (
                                    <>
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.address}
                                        value={
                                          segmentData?.hotel?.supplier?.address
                                            ?.line1 ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "hotel.supplier.address.line1",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.city}
                                        value={
                                          segmentData?.hotel?.city?.cityName ??
                                          ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "hotel.city.cityName",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.suburb}
                                        value={
                                          segmentData?.hotel?.supplier?.address
                                            ?.suburb ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "hotel.supplier.address.suburb",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.postcode}
                                        value={
                                          segmentData?.hotel?.supplier?.address
                                            ?.postcode ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "hotel.supplier.address.postcode",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.state}
                                        value={
                                          segmentData?.hotel?.supplier?.address
                                            ?.state ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "hotel.supplier.address.state",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    </>
                                  )}
                                  {type === "cruise" && (
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary.cruise.shipName
                                      }
                                      value={
                                        segmentData[type]?.cruiseDetails
                                          ?.shipName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `cruise.cruiseDetails.shipName`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  )}
                                </span>
                              </span>
                              {type === "bus" && (
                                <span className="segment-supplier">
                                  <input
                                    className="mt-1  placeholder:italic"
                                    placeholder={dict.itinerary.bus.serviceNo}
                                    value={
                                      segmentData?.bus?.busServiceNumber ?? ""
                                    }
                                    onChange={(e) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: "bus.busServiceNumber",
                                        value: e.target.value,
                                      });
                                    }}
                                  />
                                </span>
                              )}
                            </td>
                            <td className="segment-value">
                              {edit ? (
                                <span>
                                  <input
                                    className="mt-1  placeholder:italic"
                                    placeholder={dict.itinerary.reference}
                                    value={
                                      type === "flight"
                                        ? segmentData.flight?.airlineReference
                                        : (
                                            segmentData[
                                              sType as keyof SegmentCI
                                            ] as NonFlightSegment
                                          )?.bookingReference
                                    }
                                    onChange={(e) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: `${type}.${
                                          type === "flight"
                                            ? "airlineReference"
                                            : "bookingReference"
                                        }`,
                                        value: e.target.value,
                                      });
                                    }}
                                  ></input>
                                  {type === "flight" && (
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder="Status"
                                      value={segmentData?.flight?.status ?? ""}
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.status",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                  )}
                                </span>
                              ) : (
                                <span>
                                  {type === "flight"
                                    ? segmentData?.flight?.airlineReference
                                    : (
                                        segmentData[
                                          sType as keyof SegmentCI
                                        ] as NonFlightSegment
                                      )?.bookingReference}
                                  {type === "flight" && (
                                    <span>{segmentData?.flight?.status}</span>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="segment-value">
                              {type === "flight" &&
                                (edit ? (
                                  <>
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.flight?.departs?.date
                                          ? new Date(
                                              segmentData.flight.departs.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.departs.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.airport
                                      }
                                      value={
                                        segmentData?.flight?.departs?.airport
                                          ?.airportName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.departs.airport.airportName",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.airportCode
                                      }
                                      value={
                                        segmentData?.flight?.departs?.airport
                                          ?.airportCode ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.departs.airport.airportCode",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      data-itinerary="segmentData.flight.departs.airport.airportLocation.cityName"
                                      placeholder={
                                        dict.itinerary.flight.departCity
                                      }
                                      value={
                                        segmentData?.flight?.departs?.airport
                                          ?.airportLocation?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.departs.airport.airportLocation.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                  </>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.flight?.departs?.date
                                        ? formatTime(
                                            segmentData.flight.departs.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.flight?.departs?.date
                                        ? formatDate(
                                            segmentData.flight.departs.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                  </span>
                                ))}
                              {type === "hotel" &&
                                (edit ? (
                                  <DateTimePicker
                                    className="mt-1  placeholder:italic"
                                    value={{
                                      date: segmentData?.hotel?.checkinDate
                                        ? new Date(
                                            segmentData.hotel.checkinDate,
                                          )
                                        : null,
                                      hasTime: true,
                                    }}
                                    onChange={(date) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: "hotel.checkinDate",
                                        value: date.date,
                                      });
                                    }}
                                    dateFormat={dateFormat}
                                  ></DateTimePicker>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.hotel?.checkinDate
                                        ? formatTime(
                                            segmentData?.hotel?.checkinDate,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.hotel?.checkinDate
                                        ? formatDate(
                                            segmentData?.hotel?.checkinDate,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                  </span>
                                ))}
                              {type === "car" &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.car?.pickup
                                          ?.vehicleLocationDateTime
                                          ?.locationCityDateTime?.date
                                          ? new Date(
                                              segmentData.car.pickup.vehicleLocationDateTime.locationCityDateTime.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.pickup.vehicleLocationDateTime.locationCityDateTime.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.address}
                                      value={
                                        segmentData?.car?.pickup
                                          ?.vehicleLocationDateTime?.address
                                          ?.line1 ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.pickup.vehicleLocationDateTime.address.line1",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        segmentData?.car?.pickup
                                          ?.vehicleLocationDateTime
                                          ?.locationCityDateTime?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.pickup.vehicleLocationDateTime.locationCityDateTime.city.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.car?.pickup
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.date
                                        ? formatTime(
                                            segmentData?.car?.pickup
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.car?.pickup
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.date
                                        ? formatDate(
                                            segmentData.car.pickup
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {segmentData.car?.pickup
                                        ?.vehicleLocationDateTime?.address
                                        ?.line1 &&
                                        segmentData.car.pickup
                                          .vehicleLocationDateTime.address.line1
                                          .length > 0 && (
                                          <span>
                                            {
                                              segmentData.car.pickup
                                                .vehicleLocationDateTime.address
                                                .line1
                                            }
                                          </span>
                                        )}
                                      {segmentData.car?.pickup
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.city
                                        ?.cityName && (
                                        <>
                                          ,{" "}
                                          {
                                            segmentData.car.pickup
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.city
                                              .cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                              {(type === "train" ||
                                type === "bus" ||
                                type === "cruise" ||
                                type === "ferry" ||
                                type === "tour" ||
                                type === "transfer") &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.departs?.locationCityDateTime?.date
                                          ? new Date(
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentRBCF
                                              ).departs.locationCityDateTime.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.departs.locationCityDateTime.date`,
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    {type !== "cruise" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.pickupLocation
                                        }
                                        value={
                                          (
                                            segmentData?.[
                                              sType as keyof SegmentCI
                                            ] as SegmentRBCF
                                          )?.pickupLocation ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `${sType}.pickupLocation`,
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                    {type === "cruise" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.depart}
                                        value={
                                          segmentData?.cruise?.departs?.name ??
                                          ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "cruise.departs.name",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.address}
                                      value={
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.departs?.address?.line1 ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.departs.address.line1`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.departs?.locationCityDateTime?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.departs.locationCityDateTime.city.cityName`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.departs?.locationCityDateTime?.date
                                        ? formatTime(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).departs.locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.departs?.locationCityDateTime?.date
                                        ? formatDate(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).departs.locationCityDateTime
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      ).pickupLocation && (
                                        <span>
                                          {
                                            (
                                              segmentData?.[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            )?.pickupLocation
                                          }
                                          ,
                                        </span>
                                      )}
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.departs?.address?.line1 &&
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.departs?.address?.line1.length >
                                          0 && (
                                          <span>
                                            {
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentRBCF
                                              ).departs?.address.line1
                                            }
                                          </span>
                                        )}
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.departs?.locationCityDateTime?.city
                                        ?.cityName && (
                                        <>
                                          ,
                                          {
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).departs.locationCityDateTime.city
                                              ?.cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                              {(type === "activity" ||
                                type === "package" ||
                                type === "surface" ||
                                type === "insurance" ||
                                type === "miscellaneous") &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentAPS
                                        )?.departs?.date
                                          ? new Date(
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentAPS
                                              ).departs.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.departs.date`,
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    {type !== "insurance" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.city}
                                        value={
                                          (
                                            segmentData?.[
                                              sType as keyof SegmentCI
                                            ] as SegmentAPS
                                          )?.departs?.city?.cityName ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `${sType}.departs.city.cityName`,
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.departs?.date
                                        ? formatTime(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).departs.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.departs?.date
                                        ? formatDate(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).departs.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.departs?.city?.cityName && (
                                        <>
                                          ,
                                          {
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).departs.city?.cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                              {type === "ownArrangement" &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.ownArrangement?.to
                                          ?.date
                                          ? new Date(
                                              segmentData.ownArrangement.to.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "ownArrangement.to.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        segmentData?.ownArrangement?.to?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "ownArrangement.to.city.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.ownArrangement?.to?.date
                                        ? formatTime(
                                            segmentData?.ownArrangement?.to
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.ownArrangement?.to?.date
                                        ? formatDate(
                                            segmentData?.ownArrangement?.to
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {
                                        segmentData?.ownArrangement?.to?.city
                                          ?.cityName
                                      }
                                    </span>
                                  </span>
                                ))}
                            </td>
                            <td className="segment-value">
                              {type === "flight" &&
                                (edit ? (
                                  <>
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.flight?.arrives?.date
                                          ? new Date(
                                              segmentData.flight.arrives.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.arrives.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.airport
                                      }
                                      value={
                                        segmentData?.flight?.arrives?.airport
                                          ?.airportName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.arrives.airport.airportName",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={
                                        dict.itinerary.flight.airportCode
                                      }
                                      value={
                                        segmentData?.flight?.arrives?.airport
                                          ?.airportCode ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.arrives.airport.airportCode",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      data-itinerary="segmentData.flight.arrives.airport.airportLocation.cityName"
                                      placeholder={
                                        dict.itinerary.flight.arriveCity
                                      }
                                      value={
                                        segmentData?.flight?.arrives?.airport
                                          ?.airportLocation?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "flight.arrives.airport.airportLocation.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    ></input>
                                  </>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.flight?.arrives?.date
                                        ? formatTime(
                                            segmentData.flight.arrives.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.flight?.arrives?.date
                                        ? formatDate(
                                            segmentData.flight.arrives.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span>
                                      {
                                        segmentData?.flight?.arrives?.airport
                                          ?.airportName
                                      }
                                    </span>
                                    <br />
                                    <span>{`${
                                      segmentData?.flight?.arrives?.airport
                                        ?.airportCode
                                        ? segmentData.flight.arrives.airport
                                            .airportCode + ": "
                                        : ""
                                    }${
                                      segmentData.flight.arrives.airport
                                        .airportLocation.cityName
                                    }`}</span>
                                  </span>
                                ))}
                              {type === "hotel" &&
                                (edit ? (
                                  <DateTimePicker
                                    className="mt-1  placeholder:italic"
                                    value={{
                                      date: segmentData?.hotel?.checkoutDate
                                        ? new Date(
                                            segmentData.hotel.checkoutDate,
                                          )
                                        : null,
                                      hasTime: true,
                                    }}
                                    onChange={(date) => {
                                      updateSegmentDataAction({
                                        blockId: blockId,
                                        prop: "hotel.checkoutDate",
                                        value: date.date,
                                      });
                                    }}
                                    dateFormat={dateFormat}
                                  ></DateTimePicker>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.hotel?.checkoutDate
                                        ? formatTime(
                                            segmentData.hotel.checkoutDate,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.hotel?.checkoutDate
                                        ? formatDate(
                                            segmentData.hotel.checkoutDate,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                  </span>
                                ))}
                              {type === "ownArrangement" &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.ownArrangement?.from
                                          ?.date
                                          ? new Date(
                                              segmentData.ownArrangement.from.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "ownArrangement.from.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        segmentData?.ownArrangement?.from?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "ownArrangement.from.city.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.ownArrangement?.from?.date
                                        ? formatTime(
                                            segmentData?.ownArrangement?.from
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.ownArrangement?.from?.date
                                        ? formatDate(
                                            segmentData?.ownArrangement?.from
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {
                                        segmentData?.ownArrangement?.from?.city
                                          ?.cityName
                                      }
                                    </span>
                                  </span>
                                ))}
                              {type === "car" &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: segmentData?.car?.dropoff
                                          ?.vehicleLocationDateTime
                                          ?.locationCityDateTime?.date
                                          ? new Date(
                                              segmentData.car.dropoff.vehicleLocationDateTime.locationCityDateTime.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.dropoff.vehicleLocationDateTime.locationCityDateTime.date",
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.address}
                                      value={
                                        segmentData?.car?.dropoff
                                          ?.vehicleLocationDateTime?.address
                                          ?.line1 ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.dropoff.vehicleLocationDateTime.address.line1",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        segmentData?.car?.dropoff
                                          ?.vehicleLocationDateTime
                                          ?.locationCityDateTime?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: "car.dropoff.vehicleLocationDateTime.locationCityDateTime.city.cityName",
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {segmentData?.car?.dropoff
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.date
                                        ? formatTime(
                                            segmentData?.car?.dropoff
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {segmentData?.car?.dropoff
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.date
                                        ? formatDate(
                                            segmentData.car.dropoff
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {segmentData.car?.dropoff
                                        ?.vehicleLocationDateTime?.address
                                        ?.line1 &&
                                        segmentData.car.dropoff
                                          .vehicleLocationDateTime.address.line1
                                          .length > 0 && (
                                          <span>
                                            {
                                              segmentData.car.dropoff
                                                .vehicleLocationDateTime.address
                                                .line1
                                            }
                                          </span>
                                        )}
                                      {segmentData.car?.dropoff
                                        ?.vehicleLocationDateTime
                                        ?.locationCityDateTime?.city
                                        ?.cityName && (
                                        <>
                                          ,{" "}
                                          {
                                            segmentData.car.dropoff
                                              .vehicleLocationDateTime
                                              .locationCityDateTime.city
                                              .cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                              {(type === "train" ||
                                type === "bus" ||
                                type === "cruise" ||
                                type === "ferry" ||
                                type === "tour" ||
                                type === "transfer") &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.arrives?.locationCityDateTime?.date
                                          ? new Date(
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentRBCF
                                              ).arrives.locationCityDateTime.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.arrives.locationCityDateTime.date`,
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    {type !== "cruise" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.dropoffLocation
                                        }
                                        value={
                                          (
                                            segmentData?.[
                                              sType as keyof SegmentCI
                                            ] as SegmentRBCF
                                          )?.dropoffLocation ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `${sType}.dropoffLocation`,
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                    {type === "cruise" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.arrive}
                                        value={
                                          segmentData?.cruise?.arrives?.name ??
                                          ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: "cruise.arrives.name",
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.address}
                                      value={
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.arrives?.address?.line1 ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.arrives.address.line1`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                    <input
                                      className="mt-1  placeholder:italic"
                                      placeholder={dict.itinerary.city}
                                      value={
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.arrives?.locationCityDateTime?.city
                                          ?.cityName ?? ""
                                      }
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.arrives.locationCityDateTime.city.cityName`,
                                          value: e.target.value,
                                        });
                                      }}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.arrives?.locationCityDateTime?.date
                                        ? formatTime(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).arrives.locationCityDateTime.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.arrives?.locationCityDateTime?.date
                                        ? formatDate(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).arrives.locationCityDateTime
                                              ?.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      ).dropoffLocation && (
                                        <span>
                                          {
                                            (
                                              segmentData?.[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            )?.dropoffLocation
                                          }
                                          ,
                                        </span>
                                      )}
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.arrives?.address?.line1 &&
                                        (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentRBCF
                                        )?.arrives?.address?.line1.length >
                                          0 && (
                                          <span>
                                            {
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentRBCF
                                              ).arrives?.address.line1
                                            }
                                          </span>
                                        )}
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentRBCF
                                      )?.arrives?.locationCityDateTime?.city
                                        ?.cityName && (
                                        <>
                                          ,
                                          {
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentRBCF
                                            ).arrives.locationCityDateTime.city
                                              ?.cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                              {(type === "activity" ||
                                type === "package" ||
                                type === "surface" ||
                                type === "insurance" ||
                                type === "miscellaneous") &&
                                (edit ? (
                                  <span className="segment-value">
                                    <DateTimePicker
                                      className="mt-1  placeholder:italic"
                                      value={{
                                        date: (
                                          segmentData?.[
                                            sType as keyof SegmentCI
                                          ] as SegmentAPS
                                        )?.arrives?.date
                                          ? new Date(
                                              (
                                                segmentData[
                                                  sType as keyof SegmentCI
                                                ] as SegmentAPS
                                              ).arrives.date,
                                            )
                                          : null,
                                        hasTime: true,
                                      }}
                                      onChange={(date) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `${sType}.arrives.date`,
                                          value: date.date,
                                        });
                                      }}
                                      dateFormat={dateFormat}
                                    ></DateTimePicker>
                                    {type !== "insurance" && (
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={dict.itinerary.city}
                                        value={
                                          (
                                            segmentData?.[
                                              sType as keyof SegmentCI
                                            ] as SegmentAPS
                                          )?.arrives?.city?.cityName ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `${sType}.arrives.city.cityName`,
                                            value: e.target.value,
                                          });
                                        }}
                                      />
                                    )}
                                  </span>
                                ) : (
                                  <span>
                                    <span className="segment-time">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.arrives?.date
                                        ? formatTime(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).arrives.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-date">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.arrives?.date
                                        ? formatDate(
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).arrives.date,
                                          )
                                        : ""}
                                    </span>
                                    <br />
                                    <span className="segment-depart-location">
                                      {(
                                        segmentData?.[
                                          sType as keyof SegmentCI
                                        ] as SegmentAPS
                                      )?.arrives?.city?.cityName && (
                                        <>
                                          ,
                                          {
                                            (
                                              segmentData[
                                                sType as keyof SegmentCI
                                              ] as SegmentAPS
                                            ).arrives.city?.cityName
                                          }
                                        </>
                                      )}
                                    </span>
                                  </span>
                                ))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {type === "flight" && (
                      <table className="flight-pax segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>{dict.itinerary.bookingDetails.pax.pax}</div>
                            </td>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>
                                {dict.itinerary.bookingDetails.pax.seat}
                              </div>
                            </td>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>
                                {dict.itinerary.bookingDetails.pax.class}
                              </div>
                            </td>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>
                                {dict.itinerary.bookingDetails.pax.eTicket}
                              </div>
                            </td>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>{dict.itinerary.bookingDetails.pax.ff}</div>
                            </td>
                            <td className="segment-title pr-[10px] uppercase">
                              <div>
                                {dict.itinerary.bookingDetails.pax.meal}
                              </div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingData &&
                            bookingData.passengers?.passenger?.map(
                              (pax, paxIndex) => {
                                return (
                                  <tr key={paxIndex}>
                                    <td className="segment-value">
                                      {pax.firstname} {pax.lastname}
                                    </td>
                                    <td className="segment-value">
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.bookingDetails.pax.seat
                                        }
                                        value={
                                          segmentData.flight?.seating?.seat
                                            ? segmentData.flight?.seating?.seat[
                                                paxIndex
                                              ]?.seatNumber ?? ""
                                            : ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `flight.seating.seat[${paxIndex}].seatNumber`,
                                            value: e.target.value,
                                          });
                                        }}
                                      ></input>
                                    </td>
                                    {paxIndex == 0 && (
                                      <td
                                        className="segment-value"
                                        rowSpan={
                                          bookingData?.passengers?.passenger
                                            ?.length
                                        }
                                      >
                                        <input
                                          className="mt-1  placeholder:italic"
                                          placeholder={
                                            dict.itinerary.bookingDetails.pax
                                              .class
                                          }
                                          value={
                                            segmentData.flight?.classOfService
                                              ?.name ?? ""
                                          }
                                          onChange={(e) => {
                                            updateSegmentDataAction({
                                              blockId: blockId,
                                              prop: `flight.classOfService.name`,
                                              value: e.target.value,
                                            });
                                          }}
                                        ></input>
                                      </td>
                                    )}
                                    <td className="segment-value editable">
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.bookingDetails.pax
                                            .ticket
                                        }
                                        value={
                                          segmentData.flight?.flightTickets
                                            ?.flightTickets[paxIndex]
                                            ?.ticketNumber ?? ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `flight.flightTickets.flightTickets[${paxIndex}].ticketNumber`,
                                            value: e.target.value,
                                          });
                                        }}
                                      ></input>
                                    </td>
                                    <td className="segment-value editable">
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.bookingDetails.pax.ff
                                        }
                                        value={
                                          bookingData?.itinerary?.frequentFlyers
                                            ?.frequentFlyer[paxIndex]
                                            ?.membershipNumber ?? ""
                                        }
                                        onChange={(e) => {
                                          updateBookingData({
                                            blockId: blockId,
                                            prop: `itinerary.frequentFlyers.frequentFlyer[${paxIndex}].membershipNumber`,
                                            value: e.target.value,
                                          });
                                        }}
                                      ></input>
                                    </td>
                                    <td className="segment-value editable">
                                      <input
                                        className="mt-1  placeholder:italic"
                                        placeholder={
                                          dict.itinerary.bookingDetails.pax.meal
                                        }
                                        value={
                                          segmentData.flight?.meals?.meal
                                            ? segmentData.flight?.meals?.meal[
                                                paxIndex
                                              ]?.mealType?.name ?? ""
                                            : ""
                                        }
                                        onChange={(e) => {
                                          updateSegmentDataAction({
                                            blockId: blockId,
                                            prop: `flight.meals.meal[${paxIndex}].mealType.name`,
                                            value: e.target.value,
                                          });
                                        }}
                                      ></input>
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                        </tbody>
                      </table>
                    )}
                    {type === "hotel" && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.hotel.roomType}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.hotel.contact}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.noOfNights}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.hotel.noOfRooms}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.status}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.hotel.roomType}
                                value={segmentData.hotel?.roomType?.name ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `hotel.roomType.name`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.phone}
                                value={
                                  segmentData.hotel?.supplier?.phoneNumber ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "hotel.supplier.phoneNumber",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.noOfNights}
                                type="number"
                                value={segmentData.hotel?.numberOfNights ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "hotel.numberOfNights",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.hotel.noOfRooms}
                                type="number"
                                value={segmentData.hotel?.numberOfRooms ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "hotel.numberOfRooms",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.status}
                                value={segmentData.hotel?.status ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "hotel.status",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {type === "car" && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.car.carType}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.desc}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.car.noOfCars}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.duration}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.car.rate}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.status}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.car.carType}
                                value={
                                  segmentData.car?.vehicleDetails?.code ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `car.vehicleDetails.code`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.desc}
                                value={segmentData.car?.carDescription ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `car.carDescription`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.car.noOfCars}
                                type="number"
                                value={segmentData.car?.numberOfCars ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `car.numberOfCars`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.duration}
                                value={segmentData.car?.durationOfHire ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `car.durationOfHire`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.car.rate}
                                value={segmentData.car?.rate ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `car.rate`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.status}
                                value={segmentData.car?.status ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "car.status",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {(type === "bus" ||
                      type === "train" ||
                      type === "miscellaneous") && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            {type === "train" && (
                              <td className="segment-title w-1/2 pr-[10px] uppercase">
                                <div>{dict.itinerary.train.cabin}</div>
                              </td>
                            )}
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.duration}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.status}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {type === "train" && (
                              <td className="segment-value">
                                <input
                                  className="mt-1  placeholder:italic"
                                  placeholder={dict.itinerary.train.cabin}
                                  value={segmentData.rail?.railCabin ?? ""}
                                  onChange={(e) => {
                                    updateSegmentDataAction({
                                      blockId: blockId,
                                      prop: `rail.railCabin`,
                                      value: e.target.value,
                                    });
                                  }}
                                />
                              </td>
                            )}
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.duration}
                                value={
                                  segmentData[type == "train" ? "rail" : type]
                                    ?.duration ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `${sType}.duration`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.status}
                                value={
                                  segmentData[type == "train" ? "rail" : type]
                                    ?.status ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `${sType}.status`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {type === "cruise" && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.cruise.voyage}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.cruise.cabinType}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.cruise.cabinNo}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.cruise.deck}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.noOfNights}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.status}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.cruise.voyage}
                                value={segmentData.cruise?.voyageName ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `cruise.voyageName`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.cruise.cabinType}
                                value={
                                  segmentData.cruise?.cruiseDetails
                                    ?.cabinType ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `cruise.cruiseDetails.cabinType`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.cruise.cabinNo}
                                value={
                                  segmentData.cruise?.cruiseDetails
                                    ?.cabinNumber ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "cruise.cruiseDetails.cabinNumber",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.cruise.deck}
                                value={
                                  segmentData.cruise?.cruiseDetails?.deckName ??
                                  ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "cruise.cruiseDetails.deckName",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.noOfNights}
                                type="number"
                                value={
                                  segmentData.cruise?.cruiseDetails
                                    ?.numberOfNights ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "cruise.cruiseDetails.numberOfNights",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.status}
                                value={segmentData.cruise?.status ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "cruise.status",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {(type === "activity" ||
                      type === "ferry" ||
                      type === "surface" ||
                      type === "package" ||
                      type === "tour" ||
                      type === "transfer") && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            {type === "activity" && (
                              <td className="segment-title w-1/2 pr-[10px] uppercase">
                                <div>{dict.itinerary.activity.noOfUnits}</div>
                              </td>
                            )}
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.duration}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.status}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {type === "activity" && (
                              <td className="segment-value">
                                <input
                                  className="mt-1  placeholder:italic"
                                  placeholder={
                                    dict.itinerary.activity.noOfUnits
                                  }
                                  value={
                                    segmentData?.activity?.numberOfUnits ?? ""
                                  }
                                  onChange={(e) => {
                                    updateSegmentDataAction({
                                      blockId: blockId,
                                      prop: `activity.numberOfUnits`,
                                      value: e.target.value,
                                    });
                                  }}
                                />
                              </td>
                            )}
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.duration}
                                value={
                                  (
                                    segmentData[
                                      sType as keyof SegmentCI
                                    ] as SegmentAFSP
                                  )?.duration ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `${sType}.duration`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.status}
                                value={
                                  (
                                    segmentData[
                                      sType as keyof SegmentCI
                                    ] as NonFlightSegment
                                  )?.status ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `${sType}.status`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {type === "ownArrangement" && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-full pr-[10px] uppercase">
                              <div>{dict.itinerary.desc}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              <textarea
                                className="mt-1 w-full placeholder:italic"
                                placeholder={dict.itinerary.desc}
                                value={
                                  segmentData.ownArrangement?.description ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `ownArrangement.description`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {type === "insurance" && (
                      <table className="segment-inner-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.insurance.planType}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.insurance.cover}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.duration}</div>
                            </td>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div>{dict.itinerary.insurance.premium}</div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.insurance.planType}
                                value={segmentData.insurance?.planType ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `insurance.planType`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.insurance.cover}
                                value={segmentData.insurance?.cover ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: `insurance.cover`,
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.duration}
                                value={segmentData.insurance?.duration ?? ""}
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "insurance.duration",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                            <td className="segment-value">
                              <input
                                className="mt-1  placeholder:italic"
                                placeholder={dict.itinerary.insurance.premium}
                                value={
                                  segmentData.insurance?.premium?.amount ?? ""
                                }
                                onChange={(e) => {
                                  updateSegmentDataAction({
                                    blockId: blockId,
                                    prop: "insurance.premium.amount",
                                    value: e.target.value,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {(currentDocument.blocks[blockId].showRemarks ===
                      undefined ||
                      currentDocument.blocks[blockId].showRemarks === true) && (
                      <table className="segment-inner-table segment-remark-table mt-[20px] w-full">
                        <thead>
                          <tr>
                            <td className="segment-title w-1/2 pr-[10px] uppercase">
                              <div className="remarks">
                                {dict.itinerary.remarks}
                              </div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="segment-value">
                              {segmentData.remarks?.remark?.length > 0 &&
                                segmentData.remarks?.remark.map((remark, i) => {
                                  return (
                                    <textarea
                                      key={i}
                                      className="mt-1 w-full placeholder:italic"
                                      rows={4}
                                      onChange={(e) => {
                                        updateSegmentDataAction({
                                          blockId: blockId,
                                          prop: `remarks.remark[${i}].text`,
                                          value: e.target.value,
                                        });
                                      }}
                                      value={remark?.text ?? ""}
                                    ></textarea>
                                  );
                                })}
                              {(!segmentData.remarks ||
                                segmentData.remarks?.remark?.length == 0) && (
                                <textarea
                                  className="mt-1 w-full placeholder:italic"
                                  rows={4}
                                  onChange={(e) => {
                                    updateSegmentDataAction({
                                      blockId: blockId,
                                      prop: `remarks.remark[0].text`,
                                      value: e.target.value,
                                    });
                                  }}
                                ></textarea>
                              )}
                              <div></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default Flight;
