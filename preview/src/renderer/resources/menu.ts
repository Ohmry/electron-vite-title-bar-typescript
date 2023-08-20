export default [
  {
    label: '파일',
    subMenu: [
      {
        label: '새 작업공간',
        hotKey: 'Ctrl+N'
      },
      { separator: true },
      {
        label: '작업공간 열기'
      },
      {
        label: '최근 작업공간'
      },
      { separator: true },
      {
        label: '저장'
      },
      {
        label: '다른 이름으로 저장'
      },
      { separator: true },
      {
        label: '종료'
      }
    ]
  },
  {
    label: '작업',
    subMenu: [
      {
        label: '새 작업 생성'
      },
      {
        label: '선택한 작업 상단에 새 작업 생성'
      },
      {
        label: '선택한 작업 하단에 새 작업 생성'
      },
      { separator: true },
      {
        label: '새 하위 작업 생성'
      },
      {
        label: '선택한 하위 작업 상단에 새 하위 작업 생성'
      },
      {
        label: '선택한 하위 작업 하단에 새 하위 작업 생성'
      },
    ]
  },
  {
    label: '화면',
    subMenu: [
      {
        label: '체크리스트로 보기',
        hotKey: 'Ctrl+Shift+C'
      },
      {
        label: '칸반보드로 보기',
        hotKey: 'Ctrl+Shift+K'
      },
      {
        label: '간트차트로 보기',
        hotKey: 'Ctrl+Shift+G'
      }
    ]
  },
  {
    label: '도움말',
    subMenu: [
      {
        label: '앱 정보'
      }
    ]
  }
]