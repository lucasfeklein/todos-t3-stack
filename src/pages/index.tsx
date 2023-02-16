import { Button, Chip, Flex, Text, TextInput } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Trash } from 'tabler-icons-react';
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const utils = api.useContext()

  const [description, setDescription] = useState('')

  const postTodo = api.example.postTodo.useMutation({
    onSuccess: () => utils.example.getTodos.invalidate()
  })
  const updateTodo = api.example.updateTodo.useMutation({
    onSuccess: () => utils.example.getTodos.invalidate()
  })
  const deleteTodo = api.example.deleteTodo.useMutation({
    onSuccess: () => utils.example.getTodos.invalidate()
  })

  function inputHandle(e: React.ChangeEvent<HTMLInputElement>) {
    setDescription(e.target.value)
  }

  function clickHandle() {
    postTodo.mutate({ desc: description })
    setDescription('')
  }

  function checkTodo(todoId: string, checked: boolean) {
    updateTodo.mutate({ id: todoId, checked: checked })
  }

  const todos = api.example.getTodos
    .useQuery()

  const todoArr = todos.data?.map(todo =>
    <div key={todo.id} style={{ display: "flex", alignItems: "center" }}>
      <Chip
        checked={todo.isChecked}
        onChange={() => checkTodo(todo.id, !todo.isChecked)}
      >
        {todo.desc}

      </Chip>
      <Trash style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteTodo.mutate({ id: todo.id })} />
    </div>)

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'end', margin: '10px', gap: '10px' }}>
        {sessionData && <Text>Welcome, {sessionData?.user.name}</Text>}
        <button
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>

      <Flex
        style={{ paddingTop: '30px' }}
        gap="md"
        justify="center"
        align="flex-end"
        direction="row"
        wrap="wrap"
      >
        <TextInput
          placeholder="Your to-do"
          label="Place your to-do:"
          value={description}
          onChange={inputHandle}
          disabled={sessionData ? false : true}
        />
        <Button onClick={clickHandle}>Click</Button>
      </Flex>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontSize: '20px' }}>
        {todoArr}
      </div>

    </div>
  );
}

export default Home
