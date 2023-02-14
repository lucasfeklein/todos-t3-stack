import { Button, Chip, Flex, List, TextInput } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../utils/api";


const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const utils = api.useContext()

  const [description, setDescription] = useState('')

  const postTodo = api.example.postTodo.useMutation({
    onSuccess: (res) => utils.example.getTodos.invalidate()
  })
  const updateTodo = api.example.updateTodo.useMutation({
    onSuccess: (res) => utils.example.getTodos.invalidate()
  })
  const deleteTodo = api.example.deleteTodo.useMutation()

  function inputHandle(e) {
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

  const todoArr = todos.data?.map(todo => <Chip key={todo.id} checked={todo.isChecked} onChange={() => checkTodo(todo.id, !todo.isChecked)}>{todo.desc}</Chip>)

  return (
    <div>
      <Flex
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
        />
        <Button onClick={clickHandle}>Click</Button>
      </Flex>


      <List withPadding style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontSize: '20px' }}>
        {todoArr}
      </List>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>

    </div>
  );
}

export default Home
