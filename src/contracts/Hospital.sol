pragma solidity >=0.4.21 <0.7.0;

///@title hospital appointment
contract Hospital{
    address payable name;
    string public bookingName;
    address[] public array;

    struct Appointment{
        address payable patientaccount;
        string patientname;
        uint room;
        uint doctorID;
        bool isbooked;

    }
    mapping(address => Appointment) public appointments;
    event afterbooking(
        address payable patientaccount,
        string patientname,

        uint room,
        uint doctorID,
        bool isbooked

    );
    event aftercanceling(
        address payable patientaccount,
        string patientname,
        uint room,
        uint doctorID,
        bool isbooked
    );



    constructor() public {
        bookingName = "booking system for hospital";
    }

    function booking(string memory _patientname, uint _room, uint _doctorID) public {

        name = msg.sender;
        require(bytes(_patientname).length > 0, "patientname is required!");
        require(_room > 0, "room is required!");
        require(_doctorID > 0, "doctor is required and has specific length!");

        require(appointments[name].isbooked == false, "each patient should only book once!");
        for(uint i = 0; i < array.length; i++)
        {
            require(appointments[array[i]].doctorID!=_doctorID,"doctor has been booked");
            require(appointments[array[i]].room!=_room,"room has been booked");
        }

        appointments[name] = Appointment(msg.sender, _patientname, _room, _doctorID, true);
        array.push(msg.sender);
        emit afterbooking(msg.sender, _patientname, _room, _doctorID,true);
    }
    function canceling() public{
        name = msg.sender;
        require(appointments[name].isbooked==true,"this patient has booked");
        Appointment memory app = appointments[name];
        emit aftercanceling (msg.sender, app.patientname, app.room, app.doctorID, true);
        delete appointments[name];
        for(uint i = 0; i<array.length; i++)
        {
           if(array[i]==name)
           {
               delete array[i];
               break;
           }
        }
    }







}