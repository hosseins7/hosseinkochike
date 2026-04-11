export const loadChats = () => {

  const data = localStorage.getItem("chats")

  if(!data) return {}

  return JSON.parse(data)

}

export const saveChats = (chats:any) => {

  localStorage.setItem("chats", JSON.stringify(chats))

}

