const Hospital = artifacts.require("hospital");
require('chai')
.use(require('chai-as-promised'))
.should();

contract(Hospital,([deployer, patient, patient1, patient2])=>{
    let hospital;
    before(async () =>{
        hospital = await Hospital.deployed()
    })
    describe('Deployment', async()=>{
        it('The deployment should be done successfully',async() =>{
            const address = await hospital.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined) 
        })

        it('The deployed smart contract has the correct name', async()=>{
            const name = await hospital.bookingName();
            assert.equal(name, 'booking system for hospital')
        })
    })

    describe('booking and canceling', async()=>{
        let result, array
        
        before(async ()=>{
            result = await hospital.booking('Tom', 100, 22, {from: patient})
            array = await hospital.array 
        })
        
        it ('Creating booking should be successful if all correct', async ()=>{
            //SUCCESSFUL
            const event = result.logs[0].args;
           // assert.equal(array.length,1,'push one record');
            assert.equal(event.patientname, 'Tom','patient name is correct');
            assert.equal(event.room, 100,'room is correct');
            assert.equal(event.doctorID, 22, 'doctor is correct');
            assert.equal(event.isbooked, true, 'patient has no book is correct');
            assert.equal(event.patientaccount, patient, 'patient address is correct');
            
        })

        it ('Creating booking should be failed', async ()=>{
            
    
            await hospital.booking('', 200, 33, {from: patient1}).should.be.rejected;
            await hospital.booking('Jack', 0,33, {from: patient1}).should.be.rejected;
            await hospital.booking('Jack', 200, 0, {from: patient1}).should.be.rejected;

            await hospital.booking('Jack', 200,33, {from: patient1});
            await hospital.booking('Jack', 300,44, {from: patient1}).should.be.rejected;

            await hospital.booking('Amy', 200,44, {from: patient2}).should.be.rejected;
            await hospital.booking('Amy', 400,33, {from: patient2}).should.be.rejected;
        })

        it ('Check the booking created', async ()=>{
            const item = await hospital.appointments(patient);
            
            assert.equal(item.patientname, 'Tom','patient name is correct');
            assert.equal(item.room, 100,'room is correct');
            assert.equal(item.doctorID, 22, 'doctor is correct');
            assert.equal(item.patientaccount, patient, 'patient address is correct');
            assert.equal(item.isbooked, true, 'book status is correct');
        })

        it('cancel the appointment', async () => {
           

            // SUCCESS: Buyer makes purchase
            result = await hospital.canceling({from: patient});

            // Check Log
            const event = result.logs[0].args;
            assert.equal(event.patientname, 'Tom','patient name is correct');
            assert.equal(event.room, 100,'room is correct');
            assert.equal(event.doctorID, 22, 'doctor is correct');
            assert.equal(event.isbooked, true, 'patient has no book is correct');
            assert.equal(event.patientaccount, patient, 'patient address is correct');
        })
        it('be rejected if not booked', async () => {
            await hospital.canceling({from:patient2}).should.be.rejected;
        })    
            


    })
});

