const url_query = window.location.search.slice(1);
const query_data = url_query.split('=');
const character_num_selected = Number(query_data[1]);


const ApiRoute_species = 'https://pokeapi.co/api/v2/pokemon-species/';
const ApiRoute_img = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/"
const ApiRoute_img_alt = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
const ApiRoute_ico = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
const ApiRoute_default = "https://pokeapi.co/api/v2/pokemon/"


let character_flavor_selected = '';
let character_name_selected = '';
let character_genera_selected = '';
let character_color_selected = '';

console.log(character_num_selected);



fetch(ApiRoute_species + character_num_selected + '/', {
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
                console.log(data1['names'][i]['name']);
                character_name_selected = data1['names'][i]['name'];
                document.getElementById('chara_name_selected').innerHTML = character_name_selected;
            } else { }
        }
        for (var i in data1['flavor_text_entries']) {
            // console.log(data1['names'][i]);
            if (data1['flavor_text_entries'] == "") {
                character_flavor_selected = '説明が見つかりませんでした。';
                break;
            }
            if (data1['flavor_text_entries'][i]['language']['name'] == 'ja-Hrkt') {
                //document.getElementById("dispTargetArea").innerHTML = data1['name'];
                if (character_flavor_selected == null) {
                    character_flavor_selected = data1['flavor_text_entries'][i]['flavor_text'];
                    break;
                } else {
                    character_flavor_selected = character_flavor_selected + '<br>' + data1['flavor_text_entries'][i]['flavor_text'];
                }
            } else { }
        }
        if (data1['flavor_text_entries'] != "" && character_flavor_selected == null) {
            character_flavor_selected = '<div class="my-2 alart alart-info" role="alart" style="font-size: 0.8em">日本語の説明が見つかりませんでした。<br>英語で表示します。</div><div>' + data1['flavor_text_entries'][0]['flavor_text'] + '</div>';
        }
        document.getElementById('character_flavor_selected');
        console.log(character_flavor_selected);

        for (var i in data1['genera']) {
            if (data1['genera'][i]['language']['name'] == 'ja-Hrkt') {
                if (character_genera_selected == null) {
                    character_genera_selected = data1['genera'][i]['genus'];
                    break;
                } else { }
            } else { }
        }
        console.log(character_genera_selected);
        switch (data1['color']['name']) {
            case 'black':
                character_color_selected = 'くろいろ';
                break;
            case 'blue':
                character_color_selected = 'あおいろ';
                break;
            case 'brown3':
                character_color_selected = 'ちゃいろ';
                break;
            case 'gray':
                character_color_selected = 'はいいろ';
                break;
            case 'green':
                character_color_selected = 'みどりいろ';
                break;
            case 'pink':
                character_color_selected = 'ももいろ';
                break;
            case 'purple':
                character_color_selected = 'むらさきいろ';
                break;
            case 'red':
                character_color_selected = 'あかいろ';
                break;
            case 'white':
                character_color_selected = 'しろいろ';
                break;
            case 'yellow':
                character_color_selected = 'きいろ';
                break;
            default:
                character_color_selected = '';
                console.log('Error!!');
                break;
        }
        document.getElementById('chara_description_selected').innerHTML = character_genera_selected + ' / ' + character_color_selected;
        console.log(character_color_selected);
        

        document.getElementById('chara_img_selected').src = ApiRoute_img_alt + character_num_selected + '.png';
        document.getElementById('chara_img_ico').src = ApiRoute_ico + character_num_selected + '.png';
        


    })
    .finally(() => {
        // 取得完了をログに残す
        console.log("request complete!")
    });


document.getElementById('send_btn').addEventListener('click', () => {
    console.log('Sned Message')
    document.getElementById('send_btn').disabled = true;
    document.getElementById('question_field').disabled = true;
    // document.getElementById('send_icon').classList.add("bi-send", "bi-send-x");
    // document.getElementById('send_btn').classList.replace("btn-primary", "btn-secondary");

    const postData = {
        "chara_num":character_num_selected,
        "character": character_name_selected + '（ポケモン）',
        "question_sentence": document.getElementById('question_field').value
    };

    document.getElementById('question_card').innerHTML = document.getElementById('question_field').value;
    document.getElementById('question_field').value = 'ポケモンに　きいて　います。　しばらく　おまち　ください。';

    fetch("answer", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(postData)
    })
        .then(response => {
            // 回答データをjson形式で取得
            return response.json();
        })
        .then(data => {
            // テキストボックスに回答データを反映
            document.getElementById('answer_card').innerHTML = data.answer;
        })
        .finally(() => {
            // ボタンを元に戻す
            document.getElementById('send_btn').disabled = false;
            document.getElementById('question_field').disabled = false;
            console.log("request complete!")
        });
})