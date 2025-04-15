import { UserProvider } from "./context/UserContext";
import UserList from "./components/UserList";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <UserProvider>
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">
          Danh sách người dùng
        </h1>
        <UserList />
      </div>
    </UserProvider>
  );
}
export default App;
