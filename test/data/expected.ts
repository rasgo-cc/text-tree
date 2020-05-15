export const resultDefaultKeys = [
  {
    data: "A",
    id: "A",
    parentId: null,
    children: [
      {
        data: "B",
        id: "B",
        parentId: "A",
        children: [
          {
            data: "C",
            id: "C",
            parentId: "B",
            children: []
          }
        ]
      },
      {
        data: "D",
        id: "D",
        parentId: "A",
        children: []
      }
    ]
  },
  {
    data: "E",
    id: "E",
    parentId: null,
    children: [
      {
        data: "F",
        id: "F",
        parentId: "E",
        children: []
      }
    ]
  }
];

export const resultFlat = {
  tree: [
    {
      id: "A",
      parentId: null,
      children: [
        {
          id: "B",
          parentId: "A",
          children: [
            {
              id: "C",
              parentId: "B",
              children: []
            }
          ]
        },
        {
          id: "D",
          parentId: "A",
          children: []
        }
      ]
    },
    {
      id: "E",
      parentId: null,
      children: [
        {
          id: "F",
          parentId: "E",
          children: []
        }
      ]
    }
  ],
  nodes: [
    {
      data: "A",
      id: "A"
    },
    {
      data: "B",
      id: "B"
    },
    {
      data: "C",
      id: "C"
    },
    {
      data: "D",
      id: "D"
    },
    {
      data: "E",
      id: "E"
    },
    {
      data: "F",
      id: "F"
    }
  ]
};
