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
import type { BookingData, SegmentCI } from "@/types/blocks/itineary";
import {
  faEdit,
  faPlaneDeparture,
  faUserGroup,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import type { SegmentType } from "../../../editorUIHelpers/itinerary/SegmentIcon";
import SegmentIcon from "../../../editorUIHelpers/itinerary/SegmentIcon";

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

const getSegmentData = (segmentData: any, inputField: any) => {
  try {
    const val = inputField.path
      .split(".")
      .reduce((acc: any, key: string) => acc[key], segmentData);
    return inputField.type === "datetime" ? (val ? new Date(val) : null) : val;
  } catch (error) {
    return inputField.type === "datetime" ? null : "";
  }
};

const Aeroplane = ({
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

  const currentDocument = useEditor()(
    (state) => state.documentList[state.currentVersion]!,
  );
  const bookingData = currentDocument.blocks[
    type === "bookingDetails" ? blockId : parent
  ].data.segmentData as BookingData;

  const ffCount = Math.max(
    bookingData.passengers?.passenger?.length ?? 0,
    bookingData.itinerary?.frequentFlyers?.frequentFlyer?.length ?? 0,
  );

  const [paxHoverIndex, setPaxHoverIndex] = useState<null | number>(null);

  const fieldMap = {
    flight: [
      [
        {
          label: dict.itinerary.origin,
          inputs: [
            {
              input: dict.itinerary.flight.airport,
              path: "flight.departs.airport.airportName",
              type: "text",
            },
            {
              input: dict.itinerary.flight.departCity,
              path: "flight.departs.airport.airportLocation.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.destination,
          inputs: [
            {
              input: dict.itinerary.flight.airport,
              path: "flight.arrives.airport.airportName",
              type: "text",
            },
            {
              input: dict.itinerary.flight.arriveCity,
              path: "flight.arrives.airport.airportLocation.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.flight.depart,
          inputs: [
            { input: "Date", path: "flight.departs.date", type: "datetime" },
          ],
        },
        {
          label: dict.itinerary.flight.arrive,
          inputs: [
            { input: "Date", path: "flight.arrives.date", type: "datetime" },
          ],
        },
      ],
      [
        {
          label: `${dict.itinerary.flight.depart} ${dict.itinerary.flight.terminal}`,
          inputs: [
            {
              input: `${dict.itinerary.flight.depart} ${dict.itinerary.flight.terminal}`,
              path: "flight.departs.terminal",
              type: "text",
            },
          ],
        },
        {
          label: `${dict.itinerary.flight.arrive} ${dict.itinerary.flight.terminal}`,
          inputs: [
            {
              input: `${dict.itinerary.flight.arrive} ${dict.itinerary.flight.terminal}`,
              path: "flight.arrives.terminal",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.flight.reference,
          inputs: [
            {
              input: dict.itinerary.flight.reference,
              path: "flight.airlineReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "flight.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.flight.airlineFlight,
          inputs: [
            {
              input: dict.itinerary.flight.mc,
              path: "flight.marketingCarrier.name",
              type: "text",
            },
            {
              input: dict.itinerary.flight.equipment,
              path: "flight.equipment.name",
              type: "text",
            },
            {
              input: dict.itinerary.flight.flightNumber,
              path: "flight.flightNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.flight.serviceClass,
          inputs: [
            {
              input: dict.itinerary.flight.serviceClass,
              path: "flight.classOfService.name",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.flight.flyingTime,
          inputs: [
            {
              input: "",
              path: "flight.flightDuration.hours",
              type: "number",
              label: dict.itinerary.hours,
            },
            {
              input: "",
              path: "flight.flightDuration.minutes",
              type: "number",
              label: dict.itinerary.minutes,
            },
          ],
          sameline: true,
        },
        {
          label: dict.itinerary.flight.flyingDistance,
          inputs: [
            {
              input: "",
              path: "flight.miles",
              type: "number",
              label: dict.itinerary.flight.miles,
            },
          ],
          sameline: true,
        },
      ],
      [
        {
          label: dict.itinerary.flight.noOfStops,
          inputs: [
            {
              input: dict.itinerary.flight.noOfStops,
              path: "flight.numberOfStops",
              type: "number",
            },
          ],
        },
        {
          label: dict.itinerary.flight.specialRequest,
          inputs: [
            {
              input: "",
              path: "flight.specialRequest",
              type: "textarea",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    hotel: [
      [
        {
          label: dict.itinerary.hotel.supplier,
          inputs: [
            {
              input: dict.itinerary.hotel.supplier,
              path: "hotel.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.address,
          inputs: [
            {
              input: dict.itinerary.address,
              path: "hotel.supplier.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "hotel.city.cityName",
              type: "text",
            },
            {
              input: dict.itinerary.suburb,
              path: "hotel.supplier.address.suburb",
              type: "text",
            },
            {
              input: dict.itinerary.postcode,
              path: "hotel.supplier.address.postcode",
              type: "text",
            },
            {
              input: dict.itinerary.state,
              path: "hotel.supplier.address.state",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.hotel.start,
          inputs: [
            {
              input: "",
              path: "hotel.checkinDate",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.hotel.end,
          inputs: [
            {
              input: "",
              path: "hotel.checkoutDate",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.phone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "hotel.supplier.phoneNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.hotel.roomType,
          inputs: [
            {
              input: dict.itinerary.hotel.roomType,
              path: "hotel.roomType.name",
              type: "text",
            },
            {
              input: dict.itinerary.desc,
              path: "hotel.roomType.description",
              type: "textarea",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.noOfNights,
          inputs: [
            {
              input: dict.itinerary.noOfNights,
              path: "hotel.numberOfNights",
              type: "number",
            },
          ],
        },
        {
          label: dict.itinerary.hotel.noOfRooms,
          inputs: [
            {
              input: dict.itinerary.hotel.noOfRooms,
              path: "hotel.numberOfRooms",
              type: "number",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.bookingDetails.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "hotel.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "hotel.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.hotel.cancellationPolicy,
          inputs: [
            {
              input: "",
              path: "hotel.cancellationPolicy",
              type: "textarea",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    car: [
      [
        {
          label: dict.itinerary.car.supplier,
          inputs: [
            {
              input: dict.itinerary.car.supplier,
              path: "car.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.car.start,
          inputs: [
            {
              input: dict.itinerary.address,
              path: "car.pickup.vehicleLocationDateTime.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "car.pickup.vehicleLocationDateTime.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.car.end,
          inputs: [
            {
              input: dict.itinerary.address,
              path: "car.dropoff.vehicleLocationDateTime.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "car.dropoff.vehicleLocationDateTime.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.car.pickupDate,
          inputs: [
            {
              input: "",
              path: "car.pickup.vehicleLocationDateTime.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.car.dropoffDate,
          inputs: [
            {
              input: "",
              path: "car.dropoff.vehicleLocationDateTime.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.desc,
          inputs: [
            {
              input: "",
              path: "car.supplier.description",
              type: "textarea",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "car.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.car.noOfCars,
          inputs: [
            {
              input: dict.itinerary.car.noOfCars,
              path: "car.numberOfCars",
              type: "number",
            },
          ],
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "car.durationOfHire",
              type: "number",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.car.carDescription,
          inputs: [
            {
              input: "",
              path: "car.carDescription",
              type: "textarea",
            },
          ],
        },
        {
          label: dict.itinerary.car.carType,
          inputs: [
            {
              input: dict.itinerary.car.carType,
              path: "car.vehicleDetails.code",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.car.rate,
          inputs: [
            {
              input: dict.itinerary.car.rate,
              path: "car.rate",
              type: "number",
            },
          ],
        },
        {
          label: dict.itinerary.car.additionalCharge,
          inputs: [
            {
              input: dict.itinerary.car.additionalCharge,
              path: "car.additionalCharge",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    train: [
      [
        {
          label: dict.itinerary.train.supplier,
          inputs: [
            {
              input: dict.itinerary.train.supplier,
              path: "rail.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.origin,
          inputs: [
            {
              input: dict.itinerary.pickupLocation,
              path: "rail.pickupLocation",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "rail.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "rail.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.destination,
          inputs: [
            {
              input: dict.itinerary.dropoffLocation,
              path: "rail.dropoffLocation",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "rail.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "rail.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.train.start,
          inputs: [
            {
              input: "",
              path: "rail.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.train.end,
          inputs: [
            {
              input: "",
              path: "rail.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "rail.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "rail.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.train.seat,
          inputs: [
            {
              input: dict.itinerary.train.seat,
              path: "rail.railCabin",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "rail.duration",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    bus: [
      [
        {
          label: dict.itinerary.bus.supplier,
          inputs: [
            {
              input: dict.itinerary.bus.supplier,
              path: "bus.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.bus.serviceNo,
          inputs: [
            {
              input: dict.itinerary.bus.serviceNo,
              path: "bus.busServiceName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.pickupLocation,
          inputs: [
            {
              input: dict.itinerary.pickupLocation,
              path: "bus.pickupLocation",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "bus.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "bus.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.dropoffLocation,
          inputs: [
            {
              input: dict.itinerary.dropoffLocation,
              path: "bus.dropoffLocation",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "bus.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "bus.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.bus.start,
          inputs: [
            {
              input: "",
              path: "bus.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.bus.end,
          inputs: [
            {
              input: "",
              path: "bus.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "bus.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "bus.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "bus.duration",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    cruise: [
      [
        {
          label: dict.itinerary.cruise.supplier,
          inputs: [
            {
              input: dict.itinerary.cruise.supplier,
              path: "cruise.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.cruise.shipName,
          inputs: [
            {
              input: dict.itinerary.cruise.shipName,
              path: "cruise.cruiseDetails.shipName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.depart,
          inputs: [
            {
              input: dict.itinerary.depart,
              path: "cruise.departs.name",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "cruise.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "cruise.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrive,
          inputs: [
            {
              input: dict.itinerary.arrive,
              path: "cruise.arrives.name",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "cruise.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "cruise.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.cruise.start,
          inputs: [
            {
              input: "",
              path: "cruise.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.cruise.end,
          inputs: [
            {
              input: "",
              path: "cruise.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.departPhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "cruise.departs.phoneNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivePhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "cruise.arrives.phoneNumber",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.cruise.cabinNo,
          inputs: [
            {
              input: dict.itinerary.cruise.cabinNo,
              path: "cruise.cruiseDetails.cabinNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.cruise.deck,
          inputs: [
            {
              input: dict.itinerary.cruise.deck,
              path: "cruise.cruiseDetails.deckName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.cruise.cabinType,
          inputs: [
            {
              input: dict.itinerary.cruise.cabinType,
              path: "cruise.cruiseDetails.cabinType",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.noOfNights,
          inputs: [
            {
              input: "",
              path: "cruise.cruiseDetails.numberOfNights",
              type: "number",
              label: dict.itinerary.nights,
            },
          ],
          sameline: true,
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "cruise.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "cruise.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.cruise.voyage,
          inputs: [
            {
              input: dict.itinerary.cruise.voyage,
              path: "cruise.voyageName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.cruise.voyageNo,
          inputs: [
            {
              input: dict.itinerary.cruise.voyageNo,
              path: "cruise.cruiseDetails.voyageNumber",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.cruise.onBoardCredit,
          inputs: [
            {
              input: dict.itinerary.cruise.onBoardCredit,
              path: "cruise.cruiseDetails.credit",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.cruise.diningOption,
          inputs: [
            {
              input: dict.itinerary.cruise.diningOption,
              path: "cruise.cruiseDetails.dining",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    ferry: [
      [
        {
          label: dict.itinerary.ferry.supplier,
          inputs: [
            {
              input: dict.itinerary.ferry.supplier,
              path: "ferry.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.depart,
          inputs: [
            {
              input: dict.itinerary.depart,
              path: "ferry.departs.name",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "ferry.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "ferry.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
            {
              input: dict.itinerary.cityCode,
              path: "ferry.departs.locationCityDateTime.city.cityCode",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrive,
          inputs: [
            {
              input: dict.itinerary.arrive,
              path: "ferry.arrives.name",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "ferry.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "ferry.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
            {
              input: dict.itinerary.cityCode,
              path: "ferry.arrives.locationCityDateTime.city.cityCode",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.ferry.start,
          inputs: [
            {
              input: "",
              path: "ferry.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.ferry.end,
          inputs: [
            {
              input: "",
              path: "ferry.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.departPhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "ferry.departs.phoneNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivePhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "ferry.arrives.phoneNumber",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "ferry.duration",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "ferry.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "ferry.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    activity: [
      [
        {
          label: dict.itinerary.activity.supplier,
          inputs: [
            {
              input: dict.itinerary.activity.supplier,
              path: "activity.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.departureCity,
          inputs: [
            {
              input: dict.itinerary.departureCity,
              path: "activity.departs.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivalCity,
          inputs: [
            {
              input: dict.itinerary.arrivalCity,
              path: "activity.arrives.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.activity.start,
          inputs: [
            {
              input: "",
              path: "activity.departs.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.activity.end,
          inputs: [
            {
              input: "",
              path: "activity.arrives.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.activity.noOfUnits,
          inputs: [
            {
              input: "",
              path: "activity.numberOfUnits",
              type: "number",
              label: dict.itinerary.activity.units,
            },
          ],
          sameline: true,
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "activity.duration",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "activity.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "activity.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    package: [
      [
        {
          label: dict.itinerary.package.supplier,
          inputs: [
            {
              input: dict.itinerary.package.supplier,
              path: "packageCi.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.package.packageName,
          inputs: [
            {
              input: dict.itinerary.package.packageName,
              path: "packageCi.packageName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "packageCi.duration",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.departureCity,
          inputs: [
            {
              input: dict.itinerary.departureCity,
              path: "packageCi.departs.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivalCity,
          inputs: [
            {
              input: dict.itinerary.arrivalCity,
              path: "packageCi.arrives.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.package.start,
          inputs: [
            {
              input: "",
              path: "packageCi.departs.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.package.end,
          inputs: [
            {
              input: "",
              path: "packageCi.arrives.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "packageCi.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "packageCi.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    tour: [
      [
        {
          label: dict.itinerary.tour.supplier,
          inputs: [
            {
              input: dict.itinerary.tour.supplier,
              path: "tour.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.tour.noOfDays,
          inputs: [
            {
              input: "",
              path: "tour.numberOfDays",
              type: "number",
              label: dict.itinerary.tour.days,
            },
          ],
          sameline: true,
        },
      ],
      [
        {
          label: dict.itinerary.origin,
          inputs: [
            {
              input: dict.itinerary.address,
              path: "tour.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "tour.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.destination,
          inputs: [
            {
              input: dict.itinerary.address,
              path: "tour.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "tour.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.tour.start,
          inputs: [
            {
              input: "",
              path: "tour.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.tour.end,
          inputs: [
            {
              input: "",
              path: "tour.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.departPhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "tour.departs.phoneNumber",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivePhone,
          inputs: [
            {
              input: dict.itinerary.phone,
              path: "tour.arrives.phoneNumber",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "tour.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "tour.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    transfer: [
      [
        {
          label: dict.itinerary.transfer.supplier,
          inputs: [
            {
              input: dict.itinerary.transfer.supplier,
              path: "transfer.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "transfer.duration",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.pickupLocation,
          inputs: [
            {
              input: dict.itinerary.pickupLocation,
              path: "transfer.pickUp",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "transfer.departs.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "transfer.departs.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.dropoffLocation,
          inputs: [
            {
              input: dict.itinerary.dropoffLocation,
              path: "transfer.dropOff",
              type: "text",
            },
            {
              input: dict.itinerary.address,
              path: "transfer.arrives.address.line1",
              type: "text",
            },
            {
              input: dict.itinerary.city,
              path: "transfer.arrives.locationCityDateTime.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.transfer.start,
          inputs: [
            {
              input: "",
              path: "transfer.departs.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.transfer.end,
          inputs: [
            {
              input: "",
              path: "transfer.arrives.locationCityDateTime.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.desc,
          inputs: [
            {
              input: "",
              path: "transfer.supplier.description",
              type: "textarea",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "transfer.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "transfer.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    ownArrangement: [
      [
        {
          label: dict.itinerary.ownArrangement.supplier,
          inputs: [
            {
              input: dict.itinerary.ownArrangement.supplier,
              path: "ownArrangement.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.ownArrangement.from,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "ownArrangement.from.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.ownArrangement.to,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "ownArrangement.to.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.ownArrangement.start,
          inputs: [
            {
              input: "",
              path: "ownArrangement.from.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.ownArrangement.end,
          inputs: [
            {
              input: "",
              path: "ownArrangement.to.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.desc,
          inputs: [
            {
              input: "",
              path: "ownArrangement.description",
              type: "textarea",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    surface: [
      [
        {
          label: dict.itinerary.surface.supplier,
          inputs: [
            {
              input: dict.itinerary.surface.supplier,
              path: "ownArrangement.supplier.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.pickupLocation,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "surface.departs.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.dropoffLocation,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "surface.arrives.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.surface.start,
          inputs: [
            {
              input: "",
              path: "surface.departs.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.surface.end,
          inputs: [
            {
              input: "",
              path: "surface.arrives.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "surface.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "surface.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    insurance: [
      [
        {
          label: dict.itinerary.insurance.providedBy,
          inputs: [
            {
              input: dict.itinerary.insurance.supplier,
              path: "insurance.supplier.supplierCode.name",
              type: "text",
            },
          ],
          colSpan: 3,
        },
      ],
      [
        {
          label: dict.itinerary.insurance.planType,
          inputs: [
            {
              input: dict.itinerary.insurance.planType,
              path: "insurance.planType",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.insurance.cover,
          inputs: [
            {
              input: dict.itinerary.insurance.cover,
              path: "insurance.cover",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.insurance.start,
          inputs: [
            {
              input: "",
              path: "insurance.bookingDate",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.insurance.end,
          inputs: [
            {
              input: "",
              path: "insurance.terminationDate",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "insurance.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.insurance.premium,
          inputs: [
            {
              input: dict.itinerary.insurance.premium,
              path: "insurance.premium.amount",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
    miscellaneous: [
      [
        {
          label: dict.itinerary.miscellaneous.supplier,
          inputs: [
            {
              input: dict.itinerary.miscellaneous.supplier,
              path: "miscellaneous.supplier.supplierCode.name",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.duration,
          inputs: [
            {
              input: dict.itinerary.duration,
              path: "miscellaneous.duration",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.departureCity,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "miscellaneous.departs.city.cityName",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.arrivalCity,
          inputs: [
            {
              input: dict.itinerary.city,
              path: "miscellaneous.arrives.city.cityName",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.miscellaneous.start,
          inputs: [
            {
              input: "",
              path: "miscellaneous.departs.date",
              type: "datetime",
            },
          ],
        },
        {
          label: dict.itinerary.miscellaneous.end,
          inputs: [
            {
              input: "",
              path: "miscellaneous.arrives.date",
              type: "datetime",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.reference,
          inputs: [
            {
              input: dict.itinerary.reference,
              path: "miscellaneous.bookingReference",
              type: "text",
            },
          ],
        },
        {
          label: dict.itinerary.status,
          inputs: [
            {
              input: dict.itinerary.status,
              path: "miscellaneous.status",
              type: "text",
            },
          ],
        },
      ],
      [
        {
          label: dict.itinerary.remarks,
          inputs: [{ input: "", path: "remarks.remark", type: "remark" }],
          colSpan: 3,
        },
      ],
    ],
  };

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
      {type !== "bookingDetails" && (
        <div className="segment ">
          <div className="segment-heading flex items-center">
            <div className="icon ">
              <SegmentIcon
                type={type as SegmentType}
                className="fa-lg"
              ></SegmentIcon>
            </div>
            <div className="segment-heading-text ml-1">
              <h1>
                {dict.itinerary[type]?.heading2 ??
                  dict.itinerary[type]?.heading}
              </h1>
            </div>
            {"note" in dict.itinerary[type] && (
              <div className="segment-heading-subtext flex-1 text-right">
                <strong>
                  <em>{dict.itinerary[type]?.note}</em>
                </strong>
              </div>
            )}
          </div>
          <div className="segment-detail">
            <table className="segment-table black">
              <tbody>
                {fieldMap[type]?.map((row: any[], index: number) => {
                  return (
                    <tr key={index}>
                      {row.map((field) => {
                        if (
                          field.label === dict.itinerary.remarks &&
                          currentDocument.blocks[blockId].showRemarks !==
                            undefined &&
                          !currentDocument.blocks[blockId].showRemarks
                        )
                          return;
                        return (
                          <>
                            <td className="table-heading normalHeading">
                              {field.label}
                            </td>
                            <td
                              className="segment-value"
                              colSpan={field.colSpan ?? ""}
                            >
                              <div
                                className={`flex items-center gap-1 ${
                                  field.sameline ? "" : "flex-col"
                                }`}
                              >
                                {field.inputs.map(
                                  (inputField: any, i: number) => {
                                    return (
                                      <React.Fragment key={i}>
                                        {(inputField.type === "text" ||
                                          inputField.type === "number") && (
                                          <input
                                            className="w-full placeholder:italic"
                                            placeholder={inputField.input}
                                            type={inputField.type}
                                            value={getSegmentData(
                                              segmentData,
                                              inputField,
                                            )}
                                            onChange={(e) => {
                                              updateSegmentDataAction({
                                                blockId: blockId,
                                                prop: inputField.path,
                                                value: e.target.value,
                                              });
                                            }}
                                          ></input>
                                        )}
                                        {inputField.type === "textarea" && (
                                          <textarea
                                            className="w-full"
                                            placeholder={inputField.input}
                                            value={getSegmentData(
                                              segmentData,
                                              inputField,
                                            )}
                                            onChange={(e) => {
                                              updateSegmentDataAction({
                                                blockId: blockId,
                                                prop: inputField.path,
                                                value: e.target.value,
                                              });
                                            }}
                                          />
                                        )}
                                        {inputField.type === "datetime" && (
                                          <DateTimePicker
                                            value={{
                                              date: getSegmentData(
                                                segmentData,
                                                inputField,
                                              ),
                                              hasTime: true,
                                            }}
                                            onChange={(date) => {
                                              updateSegmentDataAction({
                                                blockId: blockId,
                                                prop: inputField.path,
                                                value: date.date,
                                              });
                                            }}
                                            dateFormat={dateFormat}
                                          ></DateTimePicker>
                                        )}
                                        {inputField.label && (
                                          <span>{inputField.label}</span>
                                        )}
                                        {inputField.type === "remark" && (
                                          <>
                                            {segmentData.remarks?.remark
                                              ?.length > 0 &&
                                              segmentData.remarks?.remark.map(
                                                (remark, i) => {
                                                  return (
                                                    <textarea
                                                      key={i}
                                                      className="w-full"
                                                      rows={4}
                                                      onChange={(e) => {
                                                        updateSegmentDataAction(
                                                          {
                                                            blockId: blockId,
                                                            prop: `remarks.remark[${i}].text`,
                                                            value:
                                                              e.target.value,
                                                          },
                                                        );
                                                      }}
                                                      value={remark?.text ?? ""}
                                                    ></textarea>
                                                  );
                                                },
                                              )}
                                            {(!segmentData.remarks ||
                                              segmentData.remarks?.remark
                                                ?.length == 0) && (
                                              <textarea
                                                className="my-1 w-full"
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
                                          </>
                                        )}
                                      </React.Fragment>
                                    );
                                  },
                                )}
                              </div>
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                      if (currentDocument.status !== "template") {
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
                      }
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
                  <p>{dict.itinerary.bookingDetails.pax.add}</p>
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
                    className="w-full placeholder:italic"
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
          <div className="pt-10 text-left">
            <div className="mb-10 font-bold">
              {dict.itinerary.bookingDetails.pax.ffHeader}
            </div>
            <div className="d-table w-full">
              <div className="ff-head d-table-row mb-5">
                <div className="d-table-cell underline">
                  {dict.itinerary.bookingDetails.pax.paxName}
                </div>
                <div className="d-table-cell underline">
                  {dict.itinerary.flight.airline}
                </div>
                <div className="d-table-cell underline">
                  {dict.itinerary.bookingDetails.pax.ffNo}
                </div>
              </div>
              {Array.from({ length: ffCount }, (_, paxIndex) => (
                <div className="d-table-row" key={paxIndex}>
                  <div className="d-table-cell">
                    <input
                      className="mt-1 placeholder:italic"
                      placeholder={dict.itinerary.bookingDetails.pax.pax}
                      value={
                        bookingData?.itinerary?.frequentFlyers?.frequentFlyer[
                          paxIndex
                        ]?.passengerName ?? ""
                      }
                      onChange={(e) => {
                        updateBookingData({
                          blockId: blockId,
                          prop: `itinerary.frequentFlyers.frequentFlyer[${paxIndex}].passengerName`,
                          value: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                  <div className="d-table-cell">
                    <input
                      className="mt-1 placeholder:italic"
                      placeholder={dict.itinerary.flight.airline}
                      value={
                        bookingData?.itinerary?.frequentFlyers?.frequentFlyer[
                          paxIndex
                        ]?.airline ?? ""
                      }
                      onChange={(e) => {
                        updateBookingData({
                          blockId: blockId,
                          prop: `itinerary.frequentFlyers.frequentFlyer[${paxIndex}].airline`,
                          value: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                  <div className="d-table-cell">
                    <input
                      className="mt-1 placeholder:italic"
                      placeholder={dict.itinerary.bookingDetails.pax.ff}
                      value={
                        bookingData?.itinerary?.frequentFlyers?.frequentFlyer[
                          paxIndex
                        ]?.membershipNumber ?? ""
                      }
                      onChange={(e) => {
                        updateBookingData({
                          blockId: blockId,
                          prop: `itinerary.frequentFlyers.frequentFlyer[${paxIndex}].membershipNumber`,
                          value: e.target.value,
                        });
                      }}
                    ></input>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Aeroplane;
