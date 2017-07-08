import { Context, Request } from 'azure-functions';
import alexa = require("alexa-message-builder");

export = async (context: Context, req: Request) => {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = req.body || {};
    const query = req.query || {};
    const alexaRequest = body.request;
    const alexaSession = body.session;

    if (!alexaRequest || !alexaRequest.intent) {
        context.res = {
            body: "Invalid Alexa request. Body did not contain a .request or .intent value."
        }

        return context.done();
    }

    const message = new alexa();
    const optionRegex = /[^\w]$/i;
    const intent = alexaRequest.intent;
    const items = Object.keys(intent.slots).reduce((items, slotName, self) => {
        const item = intent.slots[slotName];

        if (item.value) {
            item.value = item.value.replace(optionRegex, "");

            items.push(item)
        }

        return items;
    }, [])
    const chosen = items[Math.floor(Math.random() * items.length)];
    const text = [
        "If the options are ",
    ];

    items.forEach((item, index, self) => {
        if (index === self.length - 1) {
            text.push("and " + item.value);
        } else {
            text.push(item.value);
        }

        text.push(", ");
    });

    text.push("I would choose " + chosen.value + ".");

    context.res = {
        body: message.addText(text.join("")).get()
    }

    context.done();
};