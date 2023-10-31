import { TimestreamWriteClient, CreateDatabaseCommand } from "@aws-sdk/client-timestream-write";

export const handler = async (event) => {
    
    const timestreamClient = new TimestreamWriteClient({ });

    for (const record of event.Records) {
        // Kinesis data is base64 encoded so decode here
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        const body = JSON.parse(payload);
        const sensorData = {
            id: body.eventPayload.sensor.physicalId,
            temperature: body.eventPayload.features.temperature,
            timestamp:body.eventPayload.timestamp
        };
            
        
        console.log('Decoded payload:', sensorData);
    }
    return `Successfully processed ${event.Records.length} records.`;
};