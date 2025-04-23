const projectKey = "?projectKey=FDU-CS-Course_OceanLibWeb";

import OpenAI from "openai";
import axios from "./axios";

const codeList = [];
const choiceList = [];

const openai = new OpenAI({
    baseURL: "http://localhost:5928/api/openai",
    apiKey: "ifdu",
    dangerouslyAllowBrowser: true,
});

export async function autoCodeReview() {

    var response = await sendRequest();

    await getRawCode(response);

    var promises = codeList.map(async (element) => {
        var pro = "下面这段是一段经过SonarQube代码质量检测平台扫描的代码文件。同时给出SonarQube认为有问题的行号。它是一份在线文库平台的前端代码。你需要根据SonarQube的扫描结果，给出下列两个意见之一：这份代码是误报，或确实需要修复。你不需要任何多余的回答，如果你认为行号对应的代码确实有问题，你只需要回答我‘确实需要修复’。如果你认为代码的写法在开发及生产环境下并不会导致重大的问题，你只需要回答我“误报”即可。\n\n行号：" + element[1] + "\n\n代码：\n" + element[0] + "\n\nSonarQube提供的问题描述：\n" + element[2] + "\n\n请给出你的判断：\n\n";

        // console.log(pro);

        const ret = await axios.post('http://localhost:5928/api/openai', {
            prompt: pro,
        });

        console.log(ret.data);

        choiceList.push([extractContent(ret.data), element[3]]);
        console.log(extractContent(ret.data));
    });

    await Promise.all(promises);

    promises = choiceList.map(async (element) => {
        if (element[0] == "确实需要修复") {
            try {
                await axios({
                    method: 'post',
                    url: '/sonarcloud/api/hotspots/change_status',
                    data: {
                        "hotspot": element[1],
                        "status": "TO_REVIEW"
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
            } catch (error) {
                console.error('Axios error:', error.message);
                console.error('Request config:', error.config);
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);
            }
        } else {
            try {
                await axios({
                    method: 'post',
                    url: '/sonarcloud/api/hotspots/change_status',
                    data: {
                        "hotspot": element[1],
                        "resolution": "SAFE",
                        "status": "REVIEWED"
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
            } catch (error) {
                console.error('Axios error:', error.message);
                console.error('Request config:', error.config);
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);
            }
        }
        // console.log(element[0]);
        // console.log(element[1]);
    });

    await Promise.all(promises);
}

async function sendRequest() {
    const response = await axios.get('/sonarcloud/api/hotspots/search' + projectKey);
    var data: any;
    console.log(response.data);
    return response.data;
}

async function getRawCode(obj) {

    const promises = obj.hotspots.map(async (element) => {
        console.log(element.component);
        const response = await axios.get("/sonarcloud/api/sources/lines?key=" + element.component);
        var x = '';
        response.data.sources.forEach(element => {
            x = x + element.code.replace(/<[^>]+>/g, ''); + '\n';
        });
        // console.log(x);
        codeList.push([x, element.line, element.message, element.key]);
        // console.log(response.data);
    })

    await Promise.all(promises);

    console.log("exit getRawCode");
}

function extractContent(input) {
    const regex = /<think>[\s\S]*?<\/think>\s*\n\s*\n([\s\S]*)/;
    const match = input.match(regex);

    return match ? match[1] : input;
}