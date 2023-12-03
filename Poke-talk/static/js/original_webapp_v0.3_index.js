
// ボタンとテキストボックスのelementを取得
// const button = document.getElementById("submit_button");
// const answerText = document.getElementById("answer_text");
// const form = document.getElementById("content-question");

// リストの内容を取得
const ApiRoute_species = 'https://pokeapi.co/api/v2/pokemon-species/';
const ApiRoute_img = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/"
const ApiRoute_img_alt = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
const ApiROute_ico = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
const ApiRoute_default = "https://pokeapi.co/api/v2/pokemon/"

let characters_num = Array(8);
let characters_name = Array(8);
let characters_flavor = Array(8);
let characters_color = Array(8);
let characters_genera = Array(8);

let chara_num_selected = 0;

for (let counter1 = 0; counter1 < 8; counter1++) {
    characters_num[counter1] = Math.floor(Math.random() * 1017) + 1;
    if (characters_num[counter1] >= 1013) {
        characters_num[counter1]++;
    }
    console.log(counter1 + '-' + characters_num[counter1]);

    fetch(ApiRoute_species + characters_num[counter1] + '/', {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .then(data1 => {
            console.log(data1);
            for (var i in data1['names']) {
                // console.log(data1['names'][i]);
                if (data1['names'][i]['language']['name'] == 'ja-Hrkt') {
                    //document.getElementById("dispTargetArea").innerHTML = data1['name'];
                    characters_name[counter1] = data1['names'][i]['name'];
                    console.log(characters_name[counter1]);
                    console.log('chara_name_' + counter1);
                    document.getElementById('chara_name_' + counter1).innerHTML = characters_name[counter1];
                } else { }
            }
            for (var i in data1['flavor_text_entries']) {
                // console.log(data1['names'][i]);
                if (data1['flavor_text_entries'] == "") {
                    characters_flavor[counter1] = '説明が見つかりませんでした。';
                    break;
                }
                if (data1['flavor_text_entries'][i]['language']['name'] == 'ja-Hrkt') {
                    //document.getElementById("dispTargetArea").innerHTML = data1['name'];
                    if (characters_flavor[counter1] == null) {
                        characters_flavor[counter1] = data1['flavor_text_entries'][i]['flavor_text'];
                        break;
                    } else {
                        characters_flavor[counter1] = characters_flavor[counter1] + '\n\n' + data1['flavor_text_entries'][i]['flavor_text'];
                    }
                } else { }
            }
            if (data1['flavor_text_entries'] != "" && characters_flavor[counter1] == null) {
                characters_flavor[counter1] = '<div class="my-2 alart alart-info" role="alart" style="font-size: 0.8em">日本語の説明が見つかりませんでした。<br>英語で表示します。</div><div>' + data1['flavor_text_entries'][0]['flavor_text'] + '</div>';
            }
            console.log(characters_flavor[counter1]);
            for (var i in data1['genera']) {
                if(data1['genera'][i]['language']['name'] == 'ja-Hrkt') {
                    if (characters_genera[counter1] == null) {
                        characters_genera[counter1] = data1['genera'][i]['genus'];
                        document.getElementById('chara_genera_' + counter1).innerHTML = characters_genera[counter1];
                        break;
                    } else {}
                } else {}
            }
            console.log(characters_genera[counter1])
            switch (data1['color']['name']) {
                case 'black':
                    characters_color[counter1] = 'くろいろ';
                    break;
                case 'blue':
                    characters_color[counter1] = 'あおいろ';
                    break;
                case 'brown3':
                    characters_color[counter1] = 'ちゃいろ';
                    break;
                case 'gray':
                    characters_color[counter1] = 'はいいろ';
                    break;
                case 'green':
                    characters_color[counter1] = 'みどりいろ';
                    break;
                case 'pink':
                    characters_color[counter1] = 'ももいろ';
                    break;
                case 'purple':
                    characters_color[counter1] = 'むらさきいろ';
                    break;
                case 'red':
                    characters_color[counter1] = 'あかいろ';
                    break;
                case 'white':
                    characters_color[counter1] = 'しろいろ';
                    break;
                case 'yellow':
                    characters_color[counter1] = 'きいろ';
                    break;
                default:
                    characters_color[counter1] = '';
                    console.log('Error!!');
                    break;
            }
            document.getElementById('chara_color_' + counter1).innerHTML = characters_color[counter1];
            console.log(characters_color[counter1]);

            document.getElementById('chara_img_' + counter1).src = ApiRoute_img_alt + characters_num[counter1] + '.png';


        })
        .finally(() => {
            // 取得完了をログに残す
            console.log("request complete!")
        });
}

for (let counter1 = 0; counter1 < 8; counter1++) {
    document.getElementById('card_'+counter1).addEventListener('click', () => {
        document.getElementById('chara_name_selected').innerHTML = characters_name[counter1];
        document.getElementById('chara_description_selected').innerHTML = characters_genera[counter1] + ' / ' + characters_color[0];
        document.getElementById('chara_flavor_selected').innerHTML = characters_flavor[counter1];
        document.getElementById('chara_img_selected').src = ApiRoute_img_alt + characters_num[counter1] + '.png';
        chara_num_selected = characters_num[counter1];
        console.log('Modal configured')
    })
}

document.getElementById('btn_confirm').addEventListener('click', () => {
    console.log('Go Talkroom')
    window.location.href = 'talkroom?chara=' + chara_num_selected; 
})




// // ボタンが押されたときの挙動
// form.addEventListener("submit", ev => {
//     // ページを移動する処理を抑制
//     ev.preventDefault();

//     // ボタン表示の変更と無効化
//     button.innerHTML = "回答中...";
//     button.disabled = true;

//     // テキストボックスに回答中の旨を表示
//     answerText.innerHTML = characters_name[form.character.value] + "に聞いています。少々お待ちください。";
//     document.getElementById("chara_name").innerHTML = characters_name[form.character.value];
//     document.getElementById("chara_flavor").innerHTML = characters_flavor[form.character.value];

//     // 質問時の情報をJSONに変換する。
//     const postData = {
//         "character": characters_name[form.character.value] + '（ポケモン）',
//         "question_sentence": form.question_sentence.value
//     };

//     // バックエンドに対して回答データをリクエスト
//     fetch("answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json; charset=utf-8" },
//         body: JSON.stringify(postData)
//     })
//         .then(response => {
//             // 回答データをjson形式で取得
//             return response.json();
//         })
//         .then(data => {
//             // テキストボックスに回答データを反映
//             answerText.innerHTML = data.answer;
//         })
//         .finally(() => {
//             // ボタンを元に戻す
//             button.innerHTML = "回答させる";
//             button.disabled = false;
//             console.log("request complete!")
//         });
// });