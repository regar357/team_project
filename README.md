<h1>1.모델 환경설정 필요</h1>
<p>파이썬 라이브러리를 쉽게 설치하고 관리할 수 있게 가상환경 설정이 필요합니다.</p>

<div>
  <h4>가상환경 생성</h4>
  <p>cd ./model</p>
  <p>python -m venv venv</p>

  <h4>가상환경 실행방법</h4>
  <h5>-MacOS/Linux-</h5>
  <p>source venv/bin/activate</p>

  <h5>-Window-</h5>
  <p>venv/Scripts/activate</p>

  <h4>라이브러리 설치</h4>
  <p>pip install -r requirements.txt</p>

  <h4>가상환경 종료</h4>
  <p>deactivate</p>
</div>
<hr>
<div>
  <p>라이브러리를 추가하고 싶으면 requirements.txt에서 라이브러리 이름을 적고 설치명령어를 입력하면 됩니다.</p>

  <p>모델 작업할 때 가상환경을 실행하고 작업해주세요.</p>
  <p>가상환경이 아닌 곳에서 작업하면 라이브러리 인식이 안됩니다.</p>
</div>



<h1>2.node_modules 설치</h1>
<div>
  <p>프로젝트를 다운받으면 node_modules를 설치해야 합니다.</p>

  <p>각 파트 폴더로 이동해서 node init을 하면 설치됩니다.</p>
  <p>packege.json에 dependencies가 있기 때문에 node init을 하면 다운받을 수 있습니다.</p>
</div>
