const db = firebase.firestore();
// 시험 영역

// 이미지 업로드
const storage = firebase.storage();

var uploader;
var 뺀거;

뺀거 = localStorage.getItem("user");
if (뺀거) {
  uploader = JSON.parse(뺀거).displayName;
  console.log(uploader);
} else {
  uploader = "알 수 없음";
  console.log(uploader);
}

// 카피
$("#submit-btn").click(function () {
  var storageRef = storage.ref();
  var imagefile = document.querySelector("#inputGroupFile01").files[0];
  var 저장할경로 = storageRef.child("image/" + imagefile.name);
  var 업로드작업 = 저장할경로.put(imagefile);
  업로드작업.on(
    "state_changed",
    // 변화시 동작하는 함수
    null,
    //에러시 동작하는 함수
    (error) => {
      console.error("실패사유는", error);
    },
    // 성공시 동작하는 함수
    () => {
      업로드작업.snapshot.ref.getDownloadURL().then((url) => {
        console.log("업로드된 경로는", url);
        var tempimage = `
        <img src="${url}" alt="" style="width:100%">
        `;
        $(".image-box").append(tempimage);
        $("#input_text").val(url);
        var 저장할거 = {
          날짜: new Date(),
          제목: $(".title-input").val(),
          유저: uploader,
          경로: url,
        };

        db.collection("files")
          .add(저장할거)
          .then((result) => {
            console.log("저장 성공");
            console.log(result);
          })
          .catch((error) => {});
      });
    }
  );
});

$("#input_text").click(function () {
  var urlbox = document.getElementById("#input_text");
  urlbox.select();
  document.execCommand("Copy");
  alert("URL 이 복사 되었습니다.");
});
