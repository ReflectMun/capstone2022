import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const API_URL = "http://www.qnasavior.kro.kr";
const UPLOAD_ENDPOINT = "api/upload/image";

function getCookie(key) {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

function MyEditor({ handleChange, ...props }) {
  const token = getCookie("token");
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("files", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "PUT",
              headers: {
                authorization: token,
              },
              body: body,
              // mode: "no-cors"
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: res,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div>
      <div className="App">
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
          }}
          editor={ClassicEditor}
          onReady={(editor) => {
            editor.editing.view.change((writer) => {
              writer.setStyle(
                "height",
                "300px",
                editor.editing.view.document.getRoot()
              );
            });
          }}
          onBlur={(event, editor) => {}}
          onFocus={(event, editor) => {}}
          onChange={(event, editor) => {
            handleChange(editor.getData());
          }}
          {...props}
        />
      </div>
    </div>
  );
}
export default MyEditor;
