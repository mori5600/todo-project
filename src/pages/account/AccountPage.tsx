import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppURL } from "../../constants";
import AccountSummary from "../../features/account/AccountSummary";
import ChangePasswordForm from "../../features/account/ChangePasswordForm";

function AccountPage() {
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">アカウント</h4>
        <Button
          as={Link as any}
          to={AppURL.TODOLIST}
          variant="outline-secondary"
          size="sm"
        >
          Todo一覧へ戻る
        </Button>
      </div>
      <div className="mb-4">
        <AccountSummary />
      </div>
      <ChangePasswordForm />
    </Container>
  );
}

export default AccountPage;
