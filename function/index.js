import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env["TABLE_NAME"]


export const handler = async (event) => {
    
    const client = new DynamoDBClient({ });

    for (const record of event.Records) {
        // Kinesis data is base64 encoded so decode here
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        const body = JSON.parse(payload);
        const sensorData = {
            id: body.eventPayload.sensor.physicalId,
            temperature: body.eventPayload.features.temperature,
            timestamp:body.eventPayload.timestamp
        };
        const result = await client.send(new PutCommand({
            TableName:TABLE_NAME,
            Item:sensorData
        }));
        if (result.$metadata.httpStatusCode =! 500) {
            console.log(sensorData);
        }
        else {
            console.error("not able to put data")
        }
    }
    return `Successfully processed ${event.Records.length} records.`;
};